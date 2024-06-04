import { Registration } from "../models/registration.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerApplicant = asyncHandler( async (req, res, next) => {
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
        registerPEP
    } = req.body;


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
            registerPEP
        ].some((field) => field?.trim === "")
    ){
        throw new ApiError(409, "All fields are compulsory.")
    }

    const resumeLocalPath = req.files?.resume[0]?.path;
    const conceptNoteLocalPath = req.files?.conceptNote[0]?.path;
    const aspectNoteLocalPath = req.files?.aspectNote[0]?.path;


    if(!resumeLocalPath){
        throw new ApiError(400, "Resume is required.")
    }

    if(!conceptNoteLocalPath){
        throw new ApiError(400, "Concept Note is required.")
    }
    if(!aspectNoteLocalPath){
        throw new ApiError(400, "Aspect Note is required.")
    }

    const resume = await uploadOnCloudinary(resumeLocalPath);
    const conceptNote = await uploadOnCloudinary(conceptNoteLocalPath);
    const aspectNote = await uploadOnCloudinary(aspectNoteLocalPath);

    const registration = await Registration.create({
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
    })


    const createdRegistration = await Registration.findById(registration._id);


    if(!createdRegistration){
        throw new ApiError(500, "Registration could not be created.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdRegistration, "Registration successful.")
    )
})

export { 
    registerApplicant
}