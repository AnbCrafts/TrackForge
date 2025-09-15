import Activity from "../Models/Activity.Models.js";
import Comment from "../Models/Comment.Models.js";
import Team from "../Models/Team.Models.js";
import Project from "../Models/Project.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import User from "../Models/User.Models.js";
import validationUtils from "../Utility/Validation.Utility.js";
import mongoose from "mongoose"; 
import { uploadOnCloudinary } from "../Utility/ProjectFiles.Utility.js";
 
const getActivityData = async (activity) => {
  if (!activity || activity.length === 0) return [];

  const activities = await Promise.all(
    activity.map(async (a) => {
      const act = await Activity.findById(a);
      if (!act) return null;

      const detail = act.details;
      const project = await Project.findById(act.performedOn).select("name _id");
      const performedBy = await User.findById(act.performedBy).select("_id username email role");
      const job = await Ticket.findById(act.ticketId).select("title _id priority description assignedOn validFor status");

      return { act, project, performedBy, job, detail };
    })
  );

  // Remove any null entries (from not-found activities)
  return activities.filter((a) => a !== null);
};
const getMembersData = async (members) => {
  if (!members || members.length === 0) return [];

  const membersData = await Promise.all(
    members.map(async (m) =>
      await User.findById(m).select("_id username email firstName lastName role")
    )
  );

  return membersData.filter((m) => m !== null);
};
const getTeamData = async (team) => {
  if (!team || team.length === 0) return [];

  const teamsData = await Promise.all(
    team.map(async (t) =>
      await Team.findById(t).select("_id name link")
    )
  );

  return teamsData.filter((t) => t !== null);
};
const addNewProject = async (req, res) => {
  try {
    const { error } = validationUtils.projectCreationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, description, owner, startedOn, deadline, teams, members } = req.body;

    const existingProject = await Project.findOne({ name, owner, deadline });
    if (existingProject) return res.json({ success: false, message: "This Project already exists" });

    const validUser = await User.findById(owner);
    if (!validUser) return res.json({ success: false, message: "No user found for this ID" });
    if (validUser.role !== "Admin" && validUser.role !== "Owner")
      return res.json({ success: false, message: "You are not authorized to create a project" });

    const newProject = new Project({
      name,
      description,
      owner,
      startedOn: startedOn || Date.now(),
      deadline,
      teams,
      members,
      projectFiles: [],
    });

    newProject.members.push(owner);
    await newProject.save();
    await newProject.populate("members");

    if (newProject.members) {
      await Promise.all(
        newProject.members.map(async (m) => {
          const user = await User.findById(m);
          if (user && user.manages && !user.manages.includes(newProject._id)) {
            user.manages.push(newProject._id);
            await user.save();
          }
        })
      );
    }

    if (newProject.members) {
  newProject.members.forEach(m => {
    if (!newProject.hasAuthToSee.includes(m)) {
      newProject.hasAuthToSee.push(m);
    }
  });

  await newProject.save();
}



    





    return res.status(201).json({ success: true, message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    const owner = await User.findById(project.owner).select("_id username email firstName lastName role");

    const members = project.members?.length > 0
      ? await getMembersData(project.members)
      : [];

    const activity = project.activity?.length > 0
      ? await getActivityData(project.activity)
      : [];

    const teams = project.teams?.length > 0
      ? await getTeamData(project.teams)
      : [];

    return res.json({
      success: true,
      message: "Got the project",
      project: {
        project,
        owner,
        members,
        activity,
        teams
      }
    });
  } catch (error) {
    console.error("Project fetch error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalProjects = await User.countDocuments();
    const projects = await Project.find({})
      .skip(skip)
      .limit(limit);

    if (!projects || projects.length === 0) {
      return res.json({
        success: false,
        message: "No projects found for this page",
      });
    }

    return res.status(200).json({
      success: true,
      message: "projects fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
      projects,
    });

  } catch (error) {
    console.error("Project list fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const deleteProject = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { projectId } = req.params;
    const projectToBeDeleted = await Project.findById(projectId);

    if (!projectToBeDeleted) {
      return res.json({ success: false, message: "Project not found" });
    }

    const { tickets = [], teams = [], activity: activities = [], members = [] } = projectToBeDeleted;

    // Delete activities
    if (activities.length) {
      await Promise.allSettled(
        activities.map((a) => Activity.findByIdAndDelete(a))
      );
    }

    // Delete tickets
    if (tickets.length) {
      await Promise.allSettled(
        tickets.map((t) => Ticket.findByIdAndDelete(t))
      );
    }

    // Remove project from team.projects
    if (teams.length) {
      await Promise.allSettled(
        teams.map(async (t) => {
          const team = await Team.findById(t);
          if (team) {
            team.projects.pull(projectId);
            await team.save();
          }
        })
      );
    }

    // Remove project from user.manages
    if (members.length) {
      await Promise.allSettled(
        members.map(async (m) => {
          const user = await User.findById(m);
          if (user) {
            user.manages.pull(projectId);
            await user.save();
          }
        })
      );
    }

    // Finally delete the project
    await Project.findByIdAndDelete(projectId);

    return res.json({ success: true, message: "Deleted the project" });

  } catch (error) {
    console.error("Project deletion error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateProject = async (req, res) => {
  try {
    // ✅ Validate with stripUnknown so extra fields are removed
    const { error, value: updates } = validationUtils.projectUpdateSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { doneBy, projectId } = req.params;

    // ✅ Check if user exists
    const user = await User.findById(doneBy);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Check if project exists
    const projectDetail = await Project.findById(projectId);
    if (!projectDetail) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // ✅ Permission check: owner OR admin
    if (projectDetail.owner.toString() !== doneBy && user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "You are not authorized to update this project" });
    }

    // ✅ Apply updates safely
    Object.assign(projectDetail, updates);
    await projectDetail.save(); // runs validators + hooks
    const updatedProject = projectDetail;

    // ✅ If owner is being changed
    if (updates.owner && updates.owner.toString() !== projectDetail.owner.toString()) {
      const newOwner = await User.findById(updates.owner);
      if (newOwner) {
        if (!Array.isArray(newOwner.manages)) newOwner.manages = [];
        if (!newOwner.manages.some(id => id.toString() === projectId.toString())) {
          newOwner.manages.push(projectId);
          await newOwner.save();
        }
      } else {
        return res.json({ success: false, message: "New owner was not found." });
      }
    }

    // ✅ If members are updated
    if (updates.members && updates.members.length) {
      await Promise.all(
        updates.members.map(async (m) => {
          const member = await User.findById(m);
          if (member) {
            if (!Array.isArray(member.manages)) member.manages = [];
            if (!member.manages.some(id => id.toString() === projectId.toString())) {
              member.manages.push(projectId);
              await member.save();
            }
          }
        })
      );
    }

    // ✅ If teams are updated
    if (updates.teams && updates.teams.length) {
      await Promise.all(
        updates.teams.map(async (t) => {
          const team = await Team.findById(t);
          if (team) {
            if (!Array.isArray(team.projects)) team.projects = [];
            if (!team.projects.some(id => id.toString() === projectId.toString())) {
              team.projects.push(projectId);
              await team.save();
            }
          }
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getProjectByProjectAndOwner = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdOwnerValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { owner, project } = req.params;

    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const projectDetail = await Project.findOne({ _id: project, owner });
    if (!projectDetail) {
      return res.status(404).json({ success: false, message: "Project not found or access denied" });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project: projectDetail,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const addMember = async (req, res) => {
  try {
    const { error } = validationUtils.MemberIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { member, project } = req.params;

    const isValidUser = await User.findById(member);
    if (!isValidUser) {
      return res.status(404).json({ success: false, message: "No user found with the provided ID" });
    }

    const isProject = await Project.findById(project);
    if (!isProject) {
      return res.status(404).json({ success: false, message: "No project found with the provided ID" });
    }

    // Avoid duplicates
    if (!isProject.members.includes(member)) {
      isProject.members.push(member);
    }

    if (!isValidUser.manages.includes(project)) {
      isValidUser.manages.push(project);
    }

    await isProject.save();
    await isValidUser.save();

    return res.status(201).json({
      success: true,
      message: "User added to project successfully",
    });

  } catch (error) {
    console.error("Add member error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const removeMember = async (req, res) => {
  try {
    const { error } = validationUtils.MemberIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { member, project } = req.params;

    const isValidUser = await User.findById(member);
    if (!isValidUser) {
      return res.status(404).json({ success: false, message: "No user found with the provided ID" });
    }

    const isProject = await Project.findById(project);
    if (!isProject) {
      return res.status(404).json({ success: false, message: "No project found with the provided ID" });
    }

    // Check membership
    if (!isProject.members.includes(member)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this project",
      });
    }

    if (!isValidUser.manages.includes(project)) {
      return res.status(400).json({
        success: false,
        message: "Project is not in user's manages list",
      });
    }

    // Remove references
    isProject.members.pull(member);
    isValidUser.manages.pull(project);

    await isProject.save();
    await isValidUser.save();

    return res.status(200).json({
      success: true,
      message: "User removed from project successfully",
    });

  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getAllMembers = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;

    const project = await Project.findById(projectId).select("members");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.members.length === 0) {
      return res.status(404).json({ success: false, message: "No members found for this project" });
    }

    return res.status(200).json({
      success: true,
      message: "Project members fetched successfully",
      members: project.members,
    });

  } catch (error) {
    console.error("Get project members error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getAllProjectsOfUser = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;

    const user = await User.findById(userId).select("manages");
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with this id" });
    }

    if (!user.manages || user.manages.length === 0) {
      return res.status(404).json({ success: false, message: "This user does not manage any projects" });
    }

    const projectData = [];

    await Promise.all(
      user.manages.map(async (projectId) => {
        const project = await Project.findById(projectId);
        if (project) {
          const owner = await User.findById(project.owner).select("_id username email role");

          // Get Members of this Project
          const members = await Promise.all(
            (project.members || []).map(async (memberId) => {
              return await User.findById(memberId).select("_id username email role");
            })
          );

          // Get Activities of this Project
          const activities = await Promise.all(
            (project.activity || []).map(async (activityId) => {
              return await Activity.findById(activityId);
            })
          );

          projectData.push({
            project,
            owner,
            members,
            activities
          });
        }
      })
    );

    return res.status(200).json({
      success: true,
      message: "All projects found successfully",
      total: projectData.length,
      projects: projectData
    });

  } catch (error) {
    console.error("Get Project error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const addTeam = async (req, res) => {
  try {
    const { error } = validationUtils.projectTeamIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId, team } = req.params;

    // 1. Find project
    const isProject = await Project.findById(projectId);
    if (!isProject) {
      return res.status(404).json({ success: false, message: "No project found with the provided ID" });
    }

    // 2. Find team
    const isTeam = await Team.findById(team);
    if (!isTeam) {
      return res.status(404).json({ success: false, message: "No team found with the provided ID" });
    }

    // 3. Link project <-> team if not already linked
    if (!isProject.teams.includes(team)) {
      isProject.teams.push(team);
    }
    if (!isTeam.projects.includes(projectId)) {
      isTeam.projects.push(projectId);
    }

    // 4. Add team members to project members
    if (isTeam.members.length > 0) {
      for (const { participant } of isTeam.members) {
        if (participant && !isProject.members.includes(participant)) {
          isProject.members.push(participant);
        }
      }

      // 5. Ensure each user manages this project
      await Promise.all(
        isTeam.members.map(async ({ participant }) => {
          if (!participant) return;
          const user = await User.findById(participant);
          if (user && !user.manages.includes(projectId)) {
            user.manages.push(projectId);
            await user.save();
          }
        })
      );
    }

    // 6. Save changes
    await isProject.save();
    await isTeam.save();

    return res.status(201).json({
      success: true,
      message: "Team added to project successfully",
    });

  } catch (error) {
    console.error("Add Team error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const removeTeam = async (req, res) => {
  try {
    const { error } = validationUtils.projectTeamIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId, team } = req.params;

    const isProject = await Project.findById(projectId);
    if (!isProject) {
      return res.status(404).json({ success: false, message: "No project found with the provided ID" });
    }

    const isTeam = await Team.findById(team);
    if (!isTeam) {
      return res.status(404).json({ success: false, message: "No team found with the provided ID" });
    }

    if (!isProject.teams.includes(team)) {
      return res.status(400).json({
        success: false,
        message: "Team is not linked to this project",
      });
    }

    if (!isTeam.projects.includes(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project is not linked to this team",
      });
    }

    isProject.teams.pull(team);
    isTeam.projects.pull(projectId);

    await isProject.save();
    await isTeam.save();

    const remainingTeamIds = isProject.teams;
    const remainingTeams = await Team.find({ _id: { $in: remainingTeamIds } });
    const remainingMembersSet = new Set(
      remainingTeams.flatMap(t => t.members.map(m => m.toString()))
    );

    await Promise.all(
      isTeam.members.map(async (memberId) => {
        const memIdStr = memberId.toString();
        if (!remainingMembersSet.has(memIdStr)) {
          isProject.members.pull(memberId);
          const user = await User.findById(memberId);
          if (user) {
            user.manages.pull(projectId);
            await user.save();
          }
        }
      })
    );

    await isProject.save();

    return res.status(200).json({
      success: true,
      message: "Team removed from the project successfully",
    });

  } catch (error) {
    console.error("Remove Team error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getAllTeamsOfProject = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;

    const project = await Project.findById(projectId).select("teams");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (!project.teams || project.teams.length === 0) {
      return res.status(404).json({ success: false, message: "No teams were added to this project" });
    }

    return res.status(200).json({
      success: true,
      message: "Got the teams",
      teams: project.teams,
    });

  } catch (error) {
    console.error("Teams Fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getDeadline = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;

    const project = await Project.findById(projectId).select("deadline");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Got the deadline",
      deadline: project.deadline,
    });

  } catch (error) {
    console.error("Deadline fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const expiredDeadlineProject = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalCount = await Project.countDocuments({
      deadline: { $lt: new Date() },
    });

    const expiredProjects = await Project.find({
      deadline: { $lt: new Date() },
    })
      .skip(skip)
      .limit(limit);

    if (!expiredProjects || expiredProjects.length === 0) {
      return res.json({ success: false, message: "No expired projects found" });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched expired projects",
      totalProjects: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      projects: expiredProjects,
    });
  } catch (error) {
    console.error("Expired project fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const archiveProject = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.json({ success: false, message: "Project not found" });

    }

    await Project.findByIdAndUpdate(projectId, {
      archived: true
    }, {
      new: true,
      runValidators: true,
    })

    await project.save();


    return res.json({ success: true, message: "Archived the project", project });

  } catch (error) {
    console.error("Project Archive error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const unArchiveProject = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.json({ success: false, message: "Project not found" });

    }

    await Project.findByIdAndUpdate(projectId, {
      archived: false
    }, {
      new: true,
      runValidators: true,
    })

    await project.save();


    return res.json({ success: true, message: "Un-archived the project", project });

  } catch (error) {
    console.error("Project Archive error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getArchivedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5;
    const skip = (page - 1) * limit;


    const archivedProjects = await Project.find({ archived: true })
      .skip(skip)
      .limit(limit);

    if (!archivedProjects || archivedProjects.length === 0) {
      return res.json({ success: false, message: "No archived projects found" });
    }

    const totalCount = archivedProjects.length;
    return res.status(200).json({
      success: true,
      message: "Fetched archived projects",
      totalProjects: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      projects: archivedProjects,
    });
  } catch (error) {
    console.error("Archived project fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getUnArchivedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5;
    const skip = (page - 1) * limit;


    const UnArchivedProjects = await Project.find({ archived: false })
      .skip(skip)
      .limit(limit);

    if (!UnArchivedProjects || UnArchivedProjects.length === 0) {
      return res.json({ success: false, message: "No Un-archived projects found" });
    }

    const totalCount = UnArchivedProjects.length;
    return res.status(200).json({
      success: true,
      message: "Fetched un-archived projects",
      totalProjects: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      projects: UnArchivedProjects,
    });
  } catch (error) {
    console.error("UnArchived project fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
} 
const SearchProject = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ success: false, message: "Search term missing" });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const [projects, total] = await Promise.all([
      Project.find(filter).select("name _id").skip(skip).limit(limit),
      Project.countDocuments(filter)
    ]); 

    res.status(200).json({
      success: true,
      message: "Search successful",
      total,
      page,
      limit,
      projects
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getProjectStats = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .select("_id name teams owner members startedOn deadline archived activity");

    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    const totalMembers = project.members.length;
    const totalTeams = project.teams.length;

    const ownerDetails = await User.findById(project.owner)
      .select("_id username firstName lastName email picture status role activity lastActiveOn");

    const allTeams = [];
    const allActivities = [];
    const allTickets = [];

    await Promise.all([
      // Teams
      ...project.teams.map(async (id) => {
        const team = await Team.findById(id);
        if (team && !allTeams.find(t => t.team._id.toString() === team._id.toString())) {
          // Map members to participant IDs
          const memberIds = Array.isArray(team.members) && team.members.length > 0
            ? team.members
                .map(m => m?.participant)
                .filter(pid => mongoose.Types.ObjectId.isValid(pid))
            : [];

          const members = await User.find({ _id: { $in: memberIds } })
            .select("_id username firstName lastName email picture status role activity lastActiveOn");

          allTeams.push({ team, members });
        }
      }),

      // Activities + Tickets
      ...project.activity.map(async (id) => {
        const activity = await Activity.findById(id);
        if (activity && !allActivities.find(t => t.activity._id.toString() === activity._id.toString())) {
          const performedBy = await User.find({ _id: activity.performedBy })
            .select("_id username firstName lastName email picture status role activity lastActiveOn");

          allActivities.push({ activity, performedBy });

          const ticket = await Ticket.findById(activity.ticketId);
          if (ticket) {
            const creator = await User.findById(ticket.createdBy)
              .select("_id username firstName lastName email picture status role activity lastActiveOn");
            const assignedTo = await User.findById(ticket.assignedTo)
              .select("_id username firstName lastName email picture status role activity lastActiveOn");

            const comments = await Comment.find({ _id: { $in: ticket.comments } });

            const allComments = await Promise.all(comments.map(async (c) => {
              const commenter = await User.findById(c.userId)
                .select("_id username firstName lastName email picture status role activity lastActiveOn");
              return { comment: c, commenter };
            }));

            allTickets.push({ ticket, creator, assignedTo, allComments });
          }
        }
      })
    ]);

    const stats = {
      project: {
        id: project._id,
        name: project.name,
        totalMembers,
        owner: {
          name: `${ownerDetails.firstName} ${ownerDetails.lastName}`,
          username: ownerDetails.username,
          email: ownerDetails.email,
          picture: ownerDetails.picture,
          status: ownerDetails.status,
          role: ownerDetails.role,
          activity: ownerDetails.activity,
          lastActiveOn: ownerDetails.lastActiveOn
        },
        startedOn: project.startedOn,
        deadline: project.deadline,
        archived: project.archived,
        totalTeams,
        teams: allTeams,
        activity: allActivities,
        tickets: allTickets
      }
    };

    return res.json({ success: true, message: "Got the project stats", stats });

  } catch (error) {
    console.error("Project stats error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getAllActivities = async (req, res) => {
      try {
        const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { projectId } = req.params;

    const project = await Project.findById(projectId).select("_id name teams owner members startedOn deadline archived activity");

    if (!project) {
      return res.json({ success: false, message: "Project not found" });

    }

    const allActivities = [];
      Promise.all(
         project.activity.map(async (id) => {
        const activity = await Activity.findById(id);
        if (activity && !allActivities.find(t => t.activity._id.toString() === activity._id.toString())) {
          const performedBy = await User.find({ _id: activity.performedBy })
            .select("_id username firstName lastName email picture status role activity lastActiveOn"); // choose fields you need
          allActivities.push({ activity, performedBy });


          const ticket = await Ticket.findById(activity.ticketId); // Use findById for single _id
          if (ticket) {
            const creator = await User.findById(ticket.createdBy).select("_id username firstName lastName email picture status role activity lastActiveOn");
            const assignedTo = await User.findById(ticket.assignedTo).select("_id username firstName lastName email picture status role activity lastActiveOn");

            const comments = await Comment.find({ _id: { $in: ticket.comments } });

            const allComments = await Promise.all(comments.map(async (c) => {
              const commenter = await User.findById(c.userId).select("_id username firstName lastName email picture status role activity lastActiveOn");
              return { comment: c, commenter };
            }));

            allTickets.push({ ticket, creator, assignedTo, allComments });
          }




        }



      }),
      )

      if(!allActivities){
      return res.json({ success: false, message: "Activities not found" });
      
    }
    return res.json({ success: true, message: "All Activities found",allActivities });
      



      } catch (error) {
         console.error("Project Activity error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}

const addFilesToProject = async (req, res) => {
  try {

    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { projectId } = req.params;

    let folder;
    try {
      folder = JSON.parse(req.body.folder);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid folder JSON",
      });
    }

    if (!folder || !folder.name || !folder.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder object with valid name is required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let existingFolder = project.folders.find(
      (f) => f.name.toLowerCase() === folder.name.trim().toLowerCase()
    );

    if (!existingFolder) {
      existingFolder = { name: folder.name.trim(), files: [] };
      project.folders.push(existingFolder);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided for upload",
      });
    }

    for (const file of req.files) {
      const cloudResp = await uploadOnCloudinary(
        file.path,
        project._id.toString(),
        file.originalname
      );

      if (cloudResp) {
        existingFolder.files.push({
          filename: file.originalname,
          size: file.size,
          fileType: file.mimetype,
          uploadedBy: req.user ? req.user._id : null, 
          uploadedAt: new Date(),
          path: cloudResp.secure_url, 
        });
      }
    }

    project.markModified("folders");

    await project.save();

    return res.status(200).json({
      success: true,
      message: `Files uploaded to folder "${folder.name}" successfully`,
      folders: project.folders,
    });

  } catch (error) {
    console.error("Project Files error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};  


const getProjectFiles = async (req, res) => {
  try {
    
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { projectId } = req.params;


    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    
    if (!project.folders || project.folders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No folders or files found for this project",
      });
    }

    
    const folderWiseFiles = project.folders.map((folder) => ({
      folderName: folder.name,
      files: folder.files.map((file) => ({
        filename: file.filename,
        size: file.size,
        fileType: file.fileType,
        uploadedBy: file.uploadedBy,
        uploadedAt: file.uploadedAt,
        url: file.url,
      })),
    }));

    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      folders: folderWiseFiles,
    });
  } catch (error) {
    console.error("Get Project Files error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getUserProjectFolders = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User Id is required" });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: "Project Id is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Optional: check if user is part of the project
    if (
      project.owner.toString() !== userId &&
      !project.members.some((m) => m.toString() === userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to access this project",
      });
    }

    const folders = project.folders || [];

    if (folders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "This project has no folders",
        folders: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found all project folders",
      folders,
    });
  } catch (error) {
    console.error("Project Files fetching error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const checkForProjectAuthorization = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    if (!projectId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and projectId are required",
      });
    }

    const project = await Project.findById(projectId).populate("teams");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔑 Dynamic access check
    let hasAuth =
      project.owner?.toString() === userId ||
      project.members?.some((m) => m.toString() === userId) ||
      project.teams?.some((team) =>
        team.members?.some((m) => m.toString() === userId)
      );

    if (!hasAuth) {
      return res.status(200).json({
        success: true,
        hasAuth: false,
        message: "You don't have authority to view this project",
      });
    }

    return res.status(200).json({
      success: true,
      hasAuth: true,
      message: "You have authority to view this project",
    });
  } catch (error) {
    console.error("Authorization check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const patchJoinRequests = async (req, res) => {
  try {
    let { projectId, userId, patch } = req.params;

    if (!projectId || !userId || !patch) {
      return res.status(400).json({
        success: false,
        message: "projectId, userId, and patch status are required",
      });
    }

    patch = patch.toLowerCase();

    if (patch !== "accept" && patch !== "reject") {
      return res.status(400).json({
        success: false,
        message: "Invalid patch status. Use 'accept' or 'reject'.",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user has actually requested
    if (!project.joinRequests.some((id) => id.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: "This user has no pending request for this project",
      });
    }

    // Process request
    if (patch === "accept") {
      if (!project.hasAuthToSee.some((id) => id.toString() === userId)) {
        project.hasAuthToSee.push(userId);
        user.manages.push(projectId);
        await user.save();
      }
      if (!project.members.some((id) => id.toString() === userId)) {
        project.members.push(userId);
      }
      project.joinRequests.pull(userId);

      await project.save();
      return res.status(200).json({
        success: true,
        message: "User has been accepted into the project",
      });
    }

    if (patch === "reject") {
      if (!project.rejectedJoinRequests.some((id) => id.toString() === userId)) {
        project.rejectedJoinRequests.push(userId);
      }
      project.joinRequests.pull(userId);

      await project.save();
      return res.status(200).json({
        success: true,
        message: "User's request has been rejected",
      });
    }
  } catch (error) {
    console.error("Project Join request patch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const requestToJoinProject = async(req,res)=>{
   try {
    const { projectId, userId } = req.params;

    if (!projectId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and projectId are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Already has access?
    const alreadyHasAccess =
      project.hasAuthToSee.some((id) => id.toString() === userId) ||
      project.members.some((id) => id.toString() === userId);

    if (alreadyHasAccess) {
      return res.status(200).json({
        success: true,
        message: "You already have permission to view the project",
        status:"Access granted"
      });
    }

    // Already requested?
    if (project.joinRequests.some((id) => id.toString() === userId)) {
      return res.status(200).json({
        success: true,
        message: "You have already requested to join",
        status:"Access requested"

      });
    }

    // Rejected before?
    if (project.rejectedJoinRequests.some((id) => id.toString() === userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot join this project",
        status:"Access denied"

      });
    }


    // Example response structure
// if (!project.joinRequests.includes(userId)) {
//   return res.status(200).json({
//     success: true,
//     status: "not_requested",
//   });
// }




    // Send join request
    project.joinRequests.push(userId);
    await project.save();

    return res.status(201).json({
      success: true,
      message:
        "Your request has been sent. You will be added once the admin/owner approves.",
        status:"Sent Request"
        
    });
  } catch (error) {
    console.error("Project Join request error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const checkUserRequestStatus = async(req,res)=>{
       try {
    const { projectId, userId } = req.params;

    if (!projectId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and projectId are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Already has access?
    const alreadyHasAccess =
      project.hasAuthToSee.some((id) => id.toString() === userId) ||
      project.members.some((id) => id.toString() === userId);

    if (alreadyHasAccess) {
      return res.status(200).json({
        success: true,
        message: "You already have permission to view the project",
        status:"Access granted"
      });
    }

    // Already requested?
    if (project.joinRequests.some((id) => id.toString() === userId)) {
      return res.status(200).json({
        success: true,
        message: "You have already requested to join",
        status:"Access requested"

      });
    }

    // Rejected before?
    if (project.rejectedJoinRequests.some((id) => id.toString() === userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot join this project",
        status:"Access denied"

      });
    }

    // Send join request
    project.joinRequests.push(userId);
    await project.save();

    return res.status(201).json({
      success: true,
      message:
        "Your request has been sent. You will be added once the admin/owner approves.",
        status:"Sent Request"
        
    });
  } catch (error) {
    console.error("Project Join request error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const getJoinRequest = async (req, res) => {
  try {
    let { projectId, userId } = req.params;

    if (!projectId || !userId) {
      return res.status(400).json({
        success: false,
        message: "projectId and userId are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Allow only admin/owner to see requests
    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(200).json({
        success: true,
        message: "You are not authorized to view join requests",
        userData: [], // return empty data instead of error
      });
    }

    if (!project.joinRequests?.length) {
      return res.status(200).json({
        success: true,
        message: "No pending requests for this project",
        userData: [],
      });
    }

    const userData = await Promise.all(
      project.joinRequests.map(async (u) =>
        await User.findById(u).select("username _id")
      )
    );

    return res.status(200).json({
      success: true,
      message: "Got all pending requests for this project",
      userData,
    });
  } catch (error) {
    console.error("Project Join request fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};










export {getJoinRequest,checkUserRequestStatus,patchJoinRequests,requestToJoinProject,checkForProjectAuthorization,getUserProjectFolders,getProjectFiles,addFilesToProject, addNewProject, getProjectById, getAllProjects, deleteProject, updateProject, getProjectByProjectAndOwner, addMember, removeMember, getAllMembers, getAllProjectsOfUser, addTeam, removeTeam, getAllTeamsOfProject, getDeadline, expiredDeadlineProject, archiveProject, unArchiveProject, getArchivedList, getUnArchivedList, SearchProject, getProjectStats,getAllActivities }