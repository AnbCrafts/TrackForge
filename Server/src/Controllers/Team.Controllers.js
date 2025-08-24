import Project from "../Models/Project.Models.js";
import Team from "../Models/Team.Models.js";
import User from "../Models/User.Models.js";
import validationUtils from "../Utility/Validation.Utility.js";

const createTeam = async (req, res) => {
  try {
    const { error, value } = validationUtils.teamValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, createdBy, members } = value;

    const existingTeam = await Team.findOne({ name, createdBy }).lean();

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "⚠️ A team with this name already exists for the user",
      });
    }

    const user = await User.findById(createdBy);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "⚠️ User not found, cannot create team",
      });
    }


    const newTeam = new Team({
      ...value,
      members: [
        { participant: createdBy }, // creator is the default member
        ...(value.members || []),
      ],
    });

    const savedTeam = await newTeam.save();

    if (!Array.isArray(user.teams)) {
      user.teams = [];
    }

    user.teams.push(savedTeam._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "✅ Team created successfully",
      data: savedTeam,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to create team",
      error: err.message,
    });
  }
};
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({});

    if (!teams || teams.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot get Teams",
      });

    }

    return res.status(201).json({
      success: true,
      message: "Got all the Teams",
      teams: teams
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to create team",
      error: err.message,
    });
  }

}
const getTeamById = async (req, res) => {
  try {
    const { error } = validationUtils.teamIdValidationSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { teamId } = req.params;

    const team = await Team.findById(teamId).lean();

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    const creator = await User.findById(team.createdBy)
      .select("_id role username firstName lastName picture email status")
      .lean();

    const members = await Promise.all(
      (team.members || []).map(async (m) => {
        return await User.findById(m.participant)
          .select("_id role username firstName lastName picture email status")
          .lean();
      })
    );

    let projects = [];
    if (team.projects && team.projects.length > 0) {
      projects = await Project.find({ _id: { $in: team.projects } })
        .select("_id name description")
        .lean();
    }


    return res.status(200).json({
      success: true,
      message: "✅ Team fetched successfully",
      team: {
        raw: team,
        creator,
        members,
        projects,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to fetch team",
      error: error.message,
    });
  }
};
const deleteTeam = async (req, res) => {
  try {
    const { error } = validationUtils.teamIdValidationSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { teamId } = req.params;

    const teamToDelete = await Team.findByIdAndDelete(teamId);

    if (!teamToDelete) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found, deletion failed",
      });
    }



    return res.status(200).json({
      success: true,
      message: "✅ Team deleted successfully",

    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to fetch team",
      error: error.message,
    });
  }
}
const updateTeam = async (req, res) => {
  try {
    const { error } = validationUtils.teamIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { teamId } = req.params;

    const updates = req.body;
    const { members, projects } = req.body;
    if (!teamId) {
      return res.status(400).json({ success: false, message: "ID is required" });
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "team not found" });
    }


    const updatedTeam = await Team.findByIdAndUpdate(teamId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeam) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (members && members.length > 0) {
      await Promise.all(
        members.map(async (m) => {
          const user = await User.findById(m).select("teams");
          if (user) {
            user.teams = user.teams || [];
            if (!user.teams.includes(updatedTeam._id)) {
              user.teams.push(updatedTeam._id);
              await user.save();
            }
          }
        })
      );
    }


    if (projects && projects.length > 0) {
  await Promise.all(
    projects.map(async (projectId) => {
      const project = await Project.findById(projectId);
      if(project && project.teams && project.teams.length>=0 ){
        const teams = project.teams ;
        if (!teams.includes(projectId)) {
                teams.push(projectId);
                await project.save();
              }

      };
      

      if (members && members.length > 0) {
        await Promise.all(
          members.map(async (m) => {
            const user = await User.findById(m).select("manages");
            if (user) {
              user.manages = user.manages || [];
              if (!user.manages.includes(projectId)) {
                user.manages.push(projectId);
                await user.save();
              }
            }
          })
        );
      }
    })
  );
}




    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      team: updatedTeam,
    });



  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
const addMember = async (req, res) => {
  try {
    const { teamId, participant } = req.params;

    const { error } = validationUtils.teamIdMemberValidationSchema.validate(
      {
        teamId,
        member: {
          participant,
          joinedAt: new Date(),
        },
      },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    const alreadyInTeam = team.members.some(
      (m) => m.participant.toString() === participant
    );

    if (alreadyInTeam) {
      return res.status(409).json({
        success: false,
        message: "⚠️ User is already a member of this team",
      });
    }

    team.members.push({ participant });
    await team.save();

    const user = await User.findById(participant);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ User not found",
      });
    }

    const projects = team.projects || [];
    if (projects && projects.length > 0) {
  await Promise.all(
    projects.map(async (projectId) => {
      const user = await User.findById(participant).select("manages");
            if (user) {
              user.manages = user.manages || [];
              if (!user.manages.includes(projectId)) {
                user.manages.push(projectId);
                await user.save();
              }
            }
    })
  );
}


    if (!user.teams.includes(team._id)) {
      user.teams.push(team._id);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "✅ Member added to team successfully",
      data: team,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to add member to team",
      error: err.message,
    });
  }
};
const getAllMembers = async (req, res) => {
  try {
    const { error } = validationUtils.teamIdValidationSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { teamId } = req.params;

    const team = await Team.findById(teamId).lean();

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    const members = await Promise.all(
      (team.members || []).map(async (m) => {
        return await User.findById(m.participant)
          .select("_id username firstName lastName picture email status")
          .lean();
      })
    );



    return res.status(200).json({
      success: true,
      message: "✅ Members fetched successfully",
      members
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to fetch members",
      error: error.message,
    });
  }

}
const deleteMember = async (req, res) => {
  try {
    const { teamId, participant } = req.params;

    const { error } = validationUtils.teamIdMemberValidationSchema.validate(
      {
        teamId,
        member: {
          participant,
          joinedAt: new Date(),
        },
      },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    const presentInTeam = team.members.some(
      (m) => m.participant.toString() === participant
    );

    if (!presentInTeam) {
      return res.status(409).json({
        success: false,
        message: "⚠️ User is not a member of this team",
      });
    }

    team.members.pull({ participant });
    await team.save();

    const user = await User.findById(participant);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ User not found",
      });
    }

    if (!user.teams.includes(team._id)) {
      return res.status(404).json({
        success: false,
        message: "❌ Team was not found in Users schema",
      });
    }
    user.teams.pull(team._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "✅ Member removed from team successfully",

    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to remove member from team",
      error: err.message,
    });
  }
}
const createTeamJoiningLink = async (req, res) => {
  try {
    const { error } = validationUtils.teamLinkCreationValidationSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }



    const { teamId, userId } = req.params;

    const team = await Team.findById(teamId).lean();

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }


    if (
      team.link &&
      team.link.status === "Active" &&
      new Date(team.link.validTill) > new Date()
    ) {
      return res.status(200).json({
        success: true,
        message: "🔁 Active link already exists",
        data: team.link,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ User not found",
      });
    }

    const link = {
      url: `https://track-forge.com/invite/team/${teamId}/creator-${userId}`,
      createdAt: new Date(),
      validTill: new Date(Date.now() + 24 * 60 * 60 * 1000), // valid for 24 hours
      createdBy: userId,
      status: "Active",
    };

    const { LinkError } = validationUtils.linkValidationSchema.validate(link);
    const note = `Link must be of type - [/^https:\/\/track-forge\.com\/invite\/team\/[a-fA-F0-9]{24}\/creator-[a-fA-F0-9]{24}$/] , e.g.https://track-forge.com/invite/team/{teamId}/creator-{userId} `

    if (LinkError) {
      return res.status(400).json({
        success: false,
        errors: LinkError.details.map((err) => err.message),
        note

      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Join Link created successfully",
      link

    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to crete link",
      error: error.message,
    });
  }

}
const joinUsingLink = async (req, res) => {
  try {
    const { userId } = req.params;
    const { link } = req.body;

    // ✅ 1. Ensure `link.url` exists and matches pattern
    const match = link.url?.match(
      /^https:\/\/track-forge\.com\/invite\/team\/([a-fA-F0-9]{24})\/creator-([a-fA-F0-9]{24})$/
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid invite link format",
      });
    }

    const teamId = match[1];
    const creatorId = match[2];

    // ✅ 2. Validate full link object
    const { error } = validationUtils.joinLinkValidationSchema.validate({
      ...link,
      userId,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    // ✅ 3. Check expiration & status
    const isExpired = new Date(link.validTill) < new Date();
    if (link.status !== "Active" || isExpired) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Link is not active or has expired",
      });
    }

    // ✅ 4. Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    // ✅ 5. Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ User not found",
      });
    }

    // ✅ 6. Check if user already in team
    const alreadyInTeam = team.members.some(
      (m) => m.participant.toString() === userId
    );
    if (alreadyInTeam) {
      return res.status(409).json({
        success: false,
        message: "⚠️ User is already a member of this team",
      });
    }

    // ✅ 7. Add user to team and vice versa
    user.teams.push(team._id);
    team.members.push({ participant: userId });

    await user.save();
    await team.save();

    return res.status(200).json({
      success: true,
      message: "✅ Member added to team successfully",
      data: team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to join team",
      error: error.message,
    });
  }
};
const getLinkStatus = async (req, res) => {
  try {
    const { link } = req.body;

    const match = link.url?.match(
      /^https:\/\/track-forge\.com\/invite\/team\/([a-fA-F0-9]{24})\/creator-([a-fA-F0-9]{24})$/
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid link format",
      });
    }

    const isExpired = new Date(link.validTill) < new Date();
    const status = isExpired ? "Expired" : link.status;

    return res.status(200).json({
      success: true,
      message: `✅ Link status: ${status}`,
      status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to check link status",
      error: error.message,
    });
  }
};

const getProject = async (req, res) => {
  try {

    const { error } = validationUtils.teamIdValidationSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { teamId } = req.params;


    const team = await Team.findById(teamId).populate("projects");
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Projects fetched successfully",
      data: team.projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to fetch projects of the team",
      error: error.message,
    });
  }
};
const removeProject = async (req, res) => {
  try {
    const { error } = validationUtils.teamProjectValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { teamId, projectId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "❌ Project not found",
      });
    }

    const teamIndex = project.teams.findIndex(id => id.toString() === teamId);
    if (teamIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "❌ Team not found in the project",
      });
    }

    project.teams.splice(teamIndex, 1);
    await project.save();

    const projectIndex = team.projects.findIndex(id => id.toString() === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "❌ Project not found in the team",
      });
    }

    team.projects.splice(projectIndex, 1);
    await team.save();

    return res.status(200).json({
      success: true,
      message: "✅ Project removed from team successfully",
      team,
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to remove project",
      error: error.message,
    });
  }
};
const getAllTeamsByMember = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }


    const { userId } = req.params;

    const teams = await Team.find({ "members.participant": userId });

    return res.status(200).json({
      success: true,
      message: "✅ Teams fetched successfully",
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Failed to fetch teams",
      error: error.message,
    });
  }
};

const searchTeam = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "❌ Search term is missing or empty",
      });
    }

    const teams = await Team.find({
      name: { $regex: searchTerm, $options: "i" },
    }).select("name createdBy");

    return res.status(200).json({
      success: true,
      message: "✅ Teams fetched successfully",
      teams,
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Internal Server Error",
      error: error.message,
    });
  }
};

const getFilteredTeam = async (req, res) => {
  try {
    const { userId, name, projectId } = req.query;

    const filters = {};

    // Filter by member (participant) userId
    if (userId) {
      filters["members.participant"] = userId;
    }

    // Filter by team name (case-insensitive, partial match)
    if (name) {
      filters.name = { $regex: name, $options: "i" };
    }

    // Filter by projectId
    if (projectId) {
      filters.projects = projectId;
    }

    const teams = await Team.find(filters)
      .populate("members.participant", "firstName lastName email")
      .populate("projects", "name description");

    return res.status(200).json({
      success: true,
      message: "✅ Filtered teams retrieved successfully",
      teams,
    });
  } catch (error) {
    console.error("❌ Filtering error:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Failed to retrieve filtered teams",
      error: error.message,
    });
  }
};

const getTeamIdByName = async (req, res) => {
  try {
    const searchTerm = req.query.name;
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "❌ Search term is missing or empty",
      });
    }

    const team = await Team.findOne({ name: searchTerm }).select("_id");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "❌ No team found with the given name",
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Team fetched successfully",
      teamId: team._id,  // <-- Return only the ID
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Internal Server Error",
      error: error.message,
    });
  }
};











export { createTeam, getAllTeams, getTeamById, deleteTeam, addMember, getAllMembers, updateTeam, deleteMember, createTeamJoiningLink, joinUsingLink, getLinkStatus, getProject, removeProject, getAllTeamsByMember, searchTeam, getFilteredTeam, getTeamIdByName }

