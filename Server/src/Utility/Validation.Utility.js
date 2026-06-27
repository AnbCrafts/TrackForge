import Joi from "joi";
import mongoose from "mongoose";



// User Validations
 const userValidationSchema = Joi.object({
  username: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": "Username must be lowercase and contain no special characters.",
    }),

  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(/^(?=(?:.*[0-9]){3,})(?=(?:.*[a-zA-Z]){4,})(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, include at least 3 numbers, 4 letters, and 1 special character.",
    }),

  role: Joi.string().valid("Owner", "Admin", "Tester", "Developer", "Debugger").required(),

 picture: Joi.any().optional() ,

  teams: Joi.array().items(Joi.string().hex().length(24)).optional(),
  createdBy: Joi.string().hex().length(24).optional(),
});
 const loginValidationSchema = Joi.object({
  username: Joi.string()
    .lowercase()
    .regex(/^[a-z0-9]+$/)
    .min(3)
    .required()
    .messages({
      "string.pattern.base": "Username must not contain special characters.",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=(.*[A-Za-z]){4,})(?=(.*\d){3,})(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/)
    .required()
    .messages({
      "string.pattern.base": "Password must be at least 8 characters, include 3 numbers, 4 letters, and 1 special character.",
    }),
});
 const userIdValidationSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "userId is required.",
      "any.invalid": "Invalid userId format.",
    }),
});
 const userIdStatusValidationSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "userId is required.",
      "any.invalid": "Invalid userId format.",
    }),

    status: Joi.string().lowercase().valid('online', 'offline', 'block').required()
});
 const userIdRoleValidationSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "userId is required.",
      "any.invalid": "Invalid userId format.",
    }),

    role: Joi.string().valid("Owner", "Admin", "Tester", "Developer", "Debugger").required()
});

const updateUserValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.base": "Username must be a string.",
      "string.alphanum": "Username can only contain letters and numbers.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username must be at most 30 characters long.",
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.base": "First name must be a string.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must be at most 50 characters long.",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.base": "Last name must be a string.",
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must be at most 50 characters long.",
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Please provide a valid email address.",
    }),

  picture: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.base": "Picture must be a valid URL.",
      "string.uri": "Picture must be a valid URI/URL.",
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .optional()
    .messages({
      "string.base": "Password must be a string.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 128 characters long.",
    }),

  status: Joi.string()
    .valid("active", "inactive", "suspended")
    .optional()
    .messages({
      "any.only": "Status must be one of: active, inactive, suspended.",
    }),

  role: Joi.string()
    .valid("admin", "manager", "member")
    .optional()
    .messages({
      "any.only": "Role must be one of: admin, manager, member.",
    }),

  teams: Joi.array()
    .items(
      Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
        "string.pattern.base": "Each team ID must be a valid MongoDB ObjectId.",
      })
    )
    .optional()
    .messages({
      "array.base": "Teams must be an array of IDs.",
    }),

  manages: Joi.array()
    .items(
      Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
        "string.pattern.base": "Each project ID in manages must be a valid MongoDB ObjectId.",
      })
    )
    .optional()
    .messages({
      "array.base": "Manages must be an array of IDs.",
    }),

  activity: Joi.array()
    .items(Joi.string().optional())
    .optional()
    .messages({
      "array.base": "Activity must be an array.",
    }),
});



// Project Validations
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`⚠️ ${helpers.state.path[0]} must be a valid MongoDB ObjectId`);
  }
  return value;
};

const fileSchema = Joi.object({
  filename: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.base": "⚠️ Filename must be a string",
      "string.empty": "⚠️ Filename cannot be empty",
      "any.required": "⚠️ Filename is required",
    }),

  path: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "⚠️ File path must be a string",
      "string.empty": "⚠️ File path cannot be empty",
      "any.required": "⚠️ File path is required",
    }),

  size: Joi.number()
    .positive()
    .messages({
      "number.base": "⚠️ File size must be a number",
      "number.positive": "⚠️ File size must be a positive value",
    }),

  fileType: Joi.string()
    .trim()
    .messages({
      "string.base": "⚠️ File type must be a string (e.g., text/html, application/javascript)",
    }),

  uploadedAt: Joi.date().messages({
    "date.base": "⚠️ UploadedAt must be a valid date",
  }),

  uploadedBy: Joi.string()
    .custom(objectId)
    .messages({
      "string.base": "⚠️ UploadedBy must be a string (ObjectId)",
    }),
});




const projectCreationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "⚠️ Project name must be a string",
      "string.empty": "⚠️ Project name is required",
      "string.min": "⚠️ Project name must be at least 3 characters long",
      "string.max": "⚠️ Project name must be under 100 characters",
      "any.required": "⚠️ Project name is required",
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      "string.base": "⚠️ Description must be a string",
      "string.empty": "⚠️ Description is required",
      "string.min": "⚠️ Description must be at least 10 characters long",
      "string.max": "⚠️ Description must not exceed 1000 characters",
      "any.required": "⚠️ Description is required",
    }),

  owner: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ Owner ID is required",
      "string.base": "⚠️ Owner must be a string",
    }),

  teams: Joi.array()
    .items(Joi.string().custom(objectId))
    .messages({
      "array.base": "⚠️ Teams must be an array of valid ObjectIds",
    }),

  members: Joi.array()
    .items(Joi.string().custom(objectId))
    .messages({
      "array.base": "⚠️ Members must be an array of valid ObjectIds",
    }),

  startedOn: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.base": "⚠️ Start date must be a valid date",
      "date.greater": "⚠️ Start date must be a future date",
      "any.required": "⚠️ Start date is required",
    }),

  deadline: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.base": "⚠️ Deadline must be a valid date",
      "date.greater": "⚠️ Deadline must be a future date",
      "any.required": "⚠️ Deadline is required",
    }),

  archived: Joi.boolean().messages({
    "boolean.base": "⚠️ Archived must be a boolean value (true or false)",
  }),

  // ✅ Optional files validation
  files: Joi.array()
    .items(fileSchema)
    .optional()
    .messages({
      "array.base": "⚠️ Files must be an array of valid file objects",
    }),
});

const projectIdValidationSchema = Joi.object({
      projectId: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ project ID is required",
      "string.base": "⚠️ project must be a string",
    }),
})
const projectTeamIdValidationSchema = Joi.object({
      projectId: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ project ID is required",
      "string.base": "⚠️ project must be a string",
    }),
      team: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ Team ID is required",
      "string.base": "⚠️ Team must be a string",
    }),
})
const projectIdOwnerValidationSchema = Joi.object({
      project: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ project ID is required",
      "string.base": "⚠️ project must be a string",
    }),
      owner: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ owner ID is required",
      "string.base": "⚠️ owner must be a string",
    }),
})
 const MemberIdValidationSchema = Joi.object({
  member: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "userId is required.",
      "any.invalid": "Invalid userId format.",
    }),
    project: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "⚠️ project ID is required",
      "string.base": "⚠️ project must be a string",
    }),
    
});
 
// Activity Validations

const activityValidationSchema = Joi.object({
  ticketId: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ ticketId must be a string",
      "string.empty": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ ticketId is a required field",
    }),

  actionType: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.base": "⚠️ actionType must be a string",
      "string.empty": "⚠️ actionType is required",
      "string.min": "⚠️ actionType must be at least 3 characters",
      "any.required": "⚠️ actionType is a required field",
    }),

  performedBy: Joi.string()
    .custom(objectId, "ObjectId validation")
    .optional()
    .messages({
      "string.base": "⚠️ performedBy must be a string",
      "any.invalid": "⚠️ performedBy must be a valid MongoDB ObjectId",
    }),

  performedOn: Joi.string()
    .custom(objectId, "ObjectId validation")
    .optional()
    .messages({
      "string.base": "⚠️ performedOn must be a string",
      "any.invalid": "⚠️ performedOn must be a valid MongoDB ObjectId",
    }),

  details: Joi.string()
    .trim()
    .min(5)
    .required()
    .messages({
      "string.base": "⚠️ details must be a string",
      "string.empty": "⚠️ details is required",
      "string.min": "⚠️ details must be at least 5 characters",
      "any.required": "⚠️ details is a required field",
    }),

  doneOn: Joi.date()
    .optional()
    .messages({
      "date.base": "⚠️ doneOn must be a valid date",
    }),
});
const activityIdValidationSchema = Joi.object({
  activity: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ ticketId must be a string",
      "string.empty": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ ticketId is a required field",
    }),

 
});


const activityDeletionValidationSchema = Joi.object({
  activity: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ activityId must be a string",
      "string.empty": "⚠️ activityId is required",
      "any.invalid": "⚠️ activityId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ activityId is a required field",
    }),
  ticketId: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ ticketId must be a string",
      "string.empty": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ ticketId is a required field",
    }),

 
});
const activityTicketIdValidationSchema = Joi.object({
  ticketId: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ ticketId must be a string",
      "string.empty": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ ticketId is a required field",
    }),

 
});
const activityProjectIdValidationSchema = Joi.object({
  project: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ ticketId must be a string",
      "string.empty": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ ticketId is a required field",
    }),

 
});
const activityUserIdValidationSchema = Joi.object({
  user: Joi.string()
    .custom(objectId, "ObjectId validation")
    .required()
    .messages({
      "string.base": "⚠️ ticketId must be a string",
      "string.empty": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
      "any.required": "⚠️ ticketId is a required field",
    }),

 
});


// Team validation

const teamValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "any.required": "⚠️ Team name is required",
    "string.base": "⚠️ Team name must be a string",
    "string.min": "⚠️ Team name must be at least 3 characters long",
    "string.max": "⚠️ Team name must be less than or equal to 100 characters",
  }),

  createdBy: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ createdBy is required",
      "any.invalid": "⚠️ createdBy must be a valid MongoDB ObjectId",
    }),

  members: Joi.array()
    .items(
      Joi.object({
        participant: Joi.string()
          .custom(objectId, "ObjectId Validation")
          .required()
          .messages({
            "any.required": "⚠️ participant is required in members",
            "any.invalid": "⚠️ participant must be a valid MongoDB ObjectId",
          }),
        joinedAt: Joi.date().optional(),
      })
    )
    .optional()
    .messages({
      "array.base": "⚠️ members must be an array of participants",
    }),

  link: Joi.object({
    url: Joi.string()
      .pattern(
        /^https:\/\/track-forge\.com\/invite\/team\/[a-fA-F0-9]{24}\/creator-[a-fA-F0-9]{24}$/
      )
      .required()
      .messages({
        "string.pattern.base": "⚠️ link.url must follow the invite URL format",
        "any.required": "⚠️ link.url is required",
      }),
    createdAt: Joi.date().optional(),
    validTill: Joi.date()
      .greater("now")
      .required()
      .messages({
        "date.base": "⚠️ link.validTill must be a valid date",
        "date.greater": "⚠️ link.validTill must be a future date",
        "any.required": "⚠️ link.validTill is required",
      }),
    createdBy: Joi.string()
      .custom(objectId, "ObjectId Validation")
      .required()
      .messages({
        "any.required": "⚠️ link.createdBy is required",
        "any.invalid": "⚠️ link.createdBy must be a valid MongoDB ObjectId",
      }),
    status: Joi.string()
      .valid("Expired", "Active")
      .required()
      .messages({
        "any.only": "⚠️ link.status must be either 'Expired' or 'Active'",
        "any.required": "⚠️ link.status is required",
      }),
  }).optional(),

  projects: Joi.array()
  .items(
    Joi.string()
      .custom(objectId, "ObjectId Validation")
      .messages({
        "any.invalid": "⚠️ each project ID must be a valid MongoDB ObjectId",
      })
  )
  .optional()
  .messages({
    "array.base": "⚠️ projects must be an array of valid MongoDB ObjectIds",
  }),

});

const teamIdValidationSchema = Joi.object({
 teamId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ createdBy is required",
      "any.invalid": "⚠️ createdBy must be a valid MongoDB ObjectId",
    }),
});
const teamProjectValidationSchema = Joi.object({
 teamId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ teamId is required",
      "any.invalid": "⚠️ teamId must be a valid MongoDB ObjectId",
    }),
 projectId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ projectId is required",
      "any.invalid": "⚠️ projectId must be a valid MongoDB ObjectId",
    }),
});
const teamIdMemberValidationSchema = Joi.object({
  teamId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ teamId is required",
      "string.base": "⚠️ teamId must be a valid string",
    }),
  member: Joi.object({
    participant: Joi.string()
      .custom(objectId, "ObjectId Validation")
      .required()
      .messages({
        "any.required": "⚠️ participant is required in members",
        "string.base": "⚠️ participant must be a valid string",
      }),
    joinedAt: Joi.date().optional(),
  }),
});
const teamLinkCreationValidationSchema = Joi.object({
 teamId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ TeamId is required",
      "any.invalid": "⚠️ TeamId must be a valid MongoDB ObjectId",
    }),
 userId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ userId is required",
      "any.invalid": "⚠️ userId must be a valid MongoDB ObjectId",
    }),
});
const linkValidationSchema = Joi.object({
 url: Joi.string()
  .pattern(/^https:\/\/track-forge\.com\/invite\/team\/[a-fA-F0-9]{24}\/creator-[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "⚠️ URL must follow invite link format",
    "any.required": "⚠️ URL is required",
  }),
  createdAt: Joi.date().optional(),
  validTill: Joi.date().greater(Joi.ref("createdAt")).required().messages({
    "date.base": "⚠️ validTill must be a valid date",
    "date.greater": "⚠️ validTill must be after createdAt",
    "any.required": "⚠️ validTill is required",
  }),
  createdBy: Joi.string().custom(objectId, "ObjectId Validation").required().messages({
    "any.required": "⚠️ createdBy is required",
    "string.base": "⚠️ createdBy must be a valid ObjectId",
  }),
  status: Joi.string().valid("Active", "Expired").required().messages({
    "any.only": "⚠️ status must be either 'Active' or 'Expired'",
    "any.required": "⚠️ status is required",
  }),
});

const joinLinkValidationSchema = Joi.object({
 url: Joi.string()
  .pattern(/^https:\/\/track-forge\.com\/invite\/team\/[a-fA-F0-9]{24}\/creator-[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "⚠️ URL must follow invite link format",
    "any.required": "⚠️ URL is required",
  }),
  createdAt: Joi.date().optional(),
  validTill: Joi.date().greater(Joi.ref("createdAt")).required().messages({
    "date.base": "⚠️ validTill must be a valid date",
    "date.greater": "⚠️ validTill must be after createdAt",
    "any.required": "⚠️ validTill is required",
  }),
  createdBy: Joi.string().custom(objectId, "ObjectId Validation").required().messages({
    "any.required": "⚠️ createdBy is required",
    "string.base": "⚠️ createdBy must be a valid ObjectId",
  }),
  status: Joi.string().valid("Active", "Expired").required().messages({
    "any.only": "⚠️ status must be either 'Active' or 'Expired'",
    "any.required": "⚠️ status is required",
  }),
  userId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ userId is required",
      "any.invalid": "⚠️ userId must be a valid MongoDB ObjectId",
    }),
});


// Ticket Validation

const objectIdSchema = () => Joi.string().custom(objectId, 'ObjectId validation');

const ticketValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': '❌ Title is required',
  }),

  description: Joi.string().trim().required().messages({
    'string.empty': '❌ Description is required',
  }),

  assignedTo: objectIdSchema().allow(null, "").optional().messages({
    'any.custom': '❌ assignedTo must be a valid ObjectId',
  }),

  projectId: objectIdSchema().required().messages({
    'any.custom': '❌ projectId must be a valid ObjectId',
  }),

  createdBy: objectIdSchema().required().messages({
    'any.custom': '❌ createdBy must be a valid ObjectId',
  }),

  comments: Joi.array().items(objectIdSchema()).optional(),

  activityLog: Joi.array().items(objectIdSchema()).optional(),

  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional().allow(""),
  status: Joi.string().valid('Open', 'Closed', 'Expired', 'In Progress').optional().allow(""),
  stepsToReproduce: Joi.array().items(Joi.string()).optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
}).unknown(true); // 👈 allows extra fields safely (instead of stripUnknown)
const projectUpdateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      "string.base": "Project name must be a text value",
      "string.empty": "Project name cannot be empty",
      "string.min": "Project name must be at least {#limit} characters long",
      "string.max": "Project name must not exceed {#limit} characters",
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .messages({
      "string.base": "Description must be a text value",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least {#limit} characters long",
      "string.max": "Description must not exceed {#limit} characters",
    }),

  teams: Joi.array()
    .items(Joi.string().hex().length(24).message("Each team ID must be a valid ObjectId"))
    .messages({
      "array.base": "Teams must be an array of IDs",
    }),

  owner: Joi.string()
    .hex()
    .length(24)
    .messages({
      "string.hex": "Owner ID must be a valid ObjectId",
      "string.length": "Owner ID must be 24 characters long",
    }),

  members: Joi.array()
    .items(Joi.string().hex().length(24).message("Each member ID must be a valid ObjectId"))
    .messages({
      "array.base": "Members must be an array of IDs",
    }),

  startedOn: Joi.date()
    .less(Joi.ref("deadline"))
    .messages({
      "date.base": "StartedOn must be a valid date",
      "date.less": "StartedOn must be earlier than the deadline",
    }),

  deadline: Joi.date()
    .greater("now")
    .messages({
      "date.base": "Deadline must be a valid date",
      "date.greater": "Deadline must be a future date",
    }),

  archived: Joi.boolean()
    .messages({
      "boolean.base": "Archived must be true or false",
    }),

  activity: Joi.array()
    .items(Joi.string().hex().length(24).message("Each activity ID must be a valid ObjectId"))
    .messages({
      "array.base": "Activity must be an array of IDs",
    }),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

const ticketIdValidationSchema = Joi.object({
  ticketId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ createdBy is required",
      "any.invalid": "⚠️ createdBy must be a valid MongoDB ObjectId",
    }),
  

});
const ticketUserIdValidationSchema = Joi.object({
  ticketId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
    }),
  userId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ userId is required",
      "any.invalid": "⚠️ userId must be a valid MongoDB ObjectId",
    }),
  

});
const ticketStatusValidationSchema = Joi.object({
  ticketId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
    }),

  status: Joi.string()
    .valid('Open', 'Closed', 'Expired', 'In Progress')
    .required()
    .messages({
      "any.only": "⚠️ Status must be one of: Open, Closed, Expired, In Progress",
      "any.required": "⚠️ Status is required",
    }),
});
const ticketActivityLogValidationSchema = Joi.object({
  ticketId: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ ticketId is required",
      "any.invalid": "⚠️ ticketId must be a valid MongoDB ObjectId",
    }),

  activityLog: Joi.array()
    .items(Joi.string().custom(objectId).messages({
      'any.invalid': '❌ Each activity log must be a valid ObjectId',
    }))
    .required()
    .messages({
      'array.base': '❌ activityLog must be an array of valid ObjectIds',
      'any.required': '❌ activityLog is required',
    }),
});
const creatorIdValidationSchema = Joi.object({
  createdBy: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ createdBy is required",
      "any.invalid": "⚠️ createdBy must be a valid MongoDB ObjectId",
    }),
  

});
const assignedToIdValidationSchema = Joi.object({
  assignedTo: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ assignedTo is required",
      "any.invalid": "⚠️ assignedTo must be a valid MongoDB ObjectId",
    }),
  

});
const assignedByIdValidationSchema = Joi.object({
  assignedBy: Joi.string()
    .custom(objectId, "ObjectId Validation")
    .required()
    .messages({
      "any.required": "⚠️ assignedTo is required",
      "any.invalid": "⚠️ assignedTo must be a valid MongoDB ObjectId",
    }),
  

});

const commentValidationSchema = Joi.object({
  message: Joi.string().trim().required().messages({
    'string.empty': '❌ Comment message is required',
  }),

  userId: Joi.custom(objectId).required().messages({
    'any.required': '❌ userId is required',
    'any.invalid': '❌ userId must be a valid ObjectId',
  }),

  projectId: Joi.custom(objectId).required().messages({
    'any.required': '❌ projectId is required',
    'any.invalid': '❌ projectId must be a valid ObjectId',
  }),

  ticket: Joi.custom(objectId).required().messages({
    'any.required': '❌ ticket ID is required',
    'any.invalid': '❌ ticket must be a valid ObjectId',
  }),

  type: Joi.string().valid("Text", "Status Change", "System").required().messages({
    'any.only': '❌ type must be one of: Text, Status Change, or System',
    'any.required': '❌ type is required',
  }),
});














const validationUtils = {
  activityUserIdValidationSchema,
  activityProjectIdValidationSchema,
  activityTicketIdValidationSchema,
    userValidationSchema,loginValidationSchema,userIdValidationSchema,userIdStatusValidationSchema,userIdRoleValidationSchema,projectCreationSchema,projectIdValidationSchema,projectIdOwnerValidationSchema,MemberIdValidationSchema,projectTeamIdValidationSchema,activityValidationSchema,activityIdValidationSchema,teamValidationSchema,
    teamIdValidationSchema,
    teamIdMemberValidationSchema,
    teamLinkCreationValidationSchema,
    linkValidationSchema,joinLinkValidationSchema,teamProjectValidationSchema,ticketValidationSchema,ticketIdValidationSchema,ticketUserIdValidationSchema,ticketStatusValidationSchema,ticketActivityLogValidationSchema,
    creatorIdValidationSchema,
    assignedToIdValidationSchema,
    commentValidationSchema,assignedByIdValidationSchema,
    projectUpdateSchema,activityDeletionValidationSchema,updateUserValidation
}


export default validationUtils;


