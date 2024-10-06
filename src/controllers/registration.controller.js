import prisma from "../models/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerApplicant = asyncHandler(async (req, res, next) => {
  const {
    applicantName,
    scheme,
    email,
    phone,
    postalAddress,
    DOB,
    gender,
    category,
    education,
    experience,
    ideaDescription,
    previousRecipient,
    fullCommitment,
    noOtherFellowship,
    businessCommitment,
    noBeneficiary,
    registerPEP,
  } = req.body;

  // Check if required fields are empty
  if (
    [
      applicantName,
      scheme,
      email,
      phone,
      postalAddress,
      DOB,
      gender,
      category,
      education,
      experience,
      ideaDescription,
      previousRecipient,
      fullCommitment,
      noOtherFellowship,
      businessCommitment,
      noBeneficiary,
      registerPEP,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(409, "All fields are compulsory.");
  }

  const resumeLocalPath = req.files?.resume[0]?.path;
  const conceptNoteLocalPath = req.files?.conceptNote[0]?.path;
  const aspectNoteLocalPath = req.files?.aspectNote[0]?.path;

  // Validate that required files are present
  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume is required.");
  }
  if (!conceptNoteLocalPath) {
    throw new ApiError(400, "Concept Note is required.");
  }
  if (!aspectNoteLocalPath) {
    throw new ApiError(400, "Aspect Note is required.");
  }

  // Upload files to Cloudinary
  const resume = await uploadOnCloudinary(resumeLocalPath);
  const conceptNote = await uploadOnCloudinary(conceptNoteLocalPath);
  const aspectNote = await uploadOnCloudinary(aspectNoteLocalPath);

  // Create the registration record using Prisma
  const registration = await prisma.registration.create({
    data: {
      applicantName,
      scheme,
      email,
      phone,
      postalAddress,
      DOB: new Date(DOB), // Convert DOB to Date object
      gender,
      category,
      education,
      experience,
      resume: resume.url || "",
      ideaDescription,
      conceptNote: conceptNote.url || "",
      aspectNote: aspectNote.url || "",
      previousRecipient,
      fullCommitment,
      noOtherFellowship,
      businessCommitment,
      noBeneficiary,
      registerPEP,
    },
  });

  // Fetch the newly created registration
  const createdRegistration = await prisma.registration.findUnique({
    where: { id: registration.id },
  });

  if (!createdRegistration) {
    throw new ApiError(500, "Registration could not be created.");
  }

  // Send a successful response
  return res.status(201).json(
    new ApiResponse(200, createdRegistration, "Registration successful.")
  );
});

export { registerApplicant };
