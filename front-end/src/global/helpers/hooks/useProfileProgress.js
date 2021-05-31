import { useContext } from "react";
import { ProfileContext } from "../../context/user-profile/ProfileContext";

function useProfileProgress() {
  const { user } = useContext(ProfileContext);

  const profileProgress = () => {
    const totalGoal = 19;
    let totalProgress = 0;

    let personalInfoProgress = 0;
    let firstName = false;
    if (user.first_name) {
      totalProgress++;
      personalInfoProgress++;
      firstName = true;
    }

    let lastName = false;
    if (user.last_name) {
      totalProgress++;
      personalInfoProgress++;
      lastName = true;
    }

    let image = false;
    if (user.profile_image || user.avatar_image) {
      totalProgress++;
      personalInfoProgress++;
      image = true;
    }

    let areaOfWork = false;
    if (user.area_of_work) {
      totalProgress++;
      personalInfoProgress++;
      areaOfWork = true;
    }

    let title = false;
    if (user.desired_title) {
      totalProgress++;
      personalInfoProgress++;
      title = true;
    }

    let aboutYouProgress = 0;
    let summary = false;
    if (user.summary) {
      totalProgress++;
      aboutYouProgress++;
      summary = true;
    }

    let interestedLocations = false;
    if (user.locations?.length > 0) {
      totalProgress++;
      aboutYouProgress++;
      interestedLocations = true;
    }

    let topSkills = false;
    if (user.topSkills?.length > 0) {
      totalProgress++;
      aboutYouProgress++;
      topSkills = true;
    }

    let additionalSkills = false;
    if (user.additionalSkills?.length > 0) {
      totalProgress++;
      aboutYouProgress++;
      additionalSkills = true;
    }

    let whereToFindYouProgress = 0;
    let github = false;
    if (user.github) {
      totalProgress++;
      whereToFindYouProgress++;
      github = true;
    }

    let twitter = false;
    if (user.twitter) {
      totalProgress++;
      whereToFindYouProgress++;
      twitter = true;
    }

    let linkedin = false;
    if (user.linkedin) {
      totalProgress++;
      whereToFindYouProgress++;
      linkedin = true;
    }

    let portfolio = false;
    if (user.portfolio) {
      totalProgress++;
      whereToFindYouProgress++;
      portfolio = true;
    }

    let publicEmail = false;
    if (user.public_email) {
      totalProgress++;
      whereToFindYouProgress++;
      publicEmail = true;
    }

    let currentLocation = false;
    if (user.current_location_name) {
      totalProgress++;
      whereToFindYouProgress++;
      currentLocation = true;
    }

    let projectsProgress = 0;
    let hasProjects = false;
    if (user.projects?.length > 0) {
      totalProgress++;
      projectsProgress++;
      hasProjects = true;
    }

    let educationProgress = 0;
    let hasEducation = false;
    if (user.education?.length > 0) {
      totalProgress++;
      educationProgress++;
      hasEducation = true;
    }

    let experienceProgress = 0;
    let hasExperience = false;
    if (user.experience?.length > 0) {
      totalProgress++;
      experienceProgress++;
      hasExperience = true;
    }

    let billingProgress = 0;
    let hasSubscription = false;
    if (user.stripe_subscription_name) {
      totalProgress++;
      billingProgress++;
      hasSubscription = true;
    }

    totalProgress = Math.ceil((totalProgress / totalGoal) * 100);

    return {
      totalProgress,
      personalInfo: {
        progress: Math.ceil((personalInfoProgress / 5) * 100),
        firstName,
        lastName,
        image,
        areaOfWork,
        title,
      },
      aboutYou: {
        progress: Math.ceil((aboutYouProgress / 4) * 100),
        summary,
        interestedLocations,
        topSkills,
        additionalSkills,
      },
      whereToFindYou: {
        progress: Math.ceil((whereToFindYouProgress / 6) * 100),
        github,
        twitter,
        linkedin,
        portfolio,
        publicEmail,
        currentLocation,
      },
      projects: {
        progress: Math.ceil((projectsProgress / 1) * 100),
        hasProjects,
      },
      education: {
        progress: Math.ceil((educationProgress / 1) * 100),
        hasEducation,
      },
      experience: {
        progress: Math.ceil((experienceProgress / 1) * 100),
        hasExperience,
      },
      billing: {
        progress: Math.ceil((billingProgress / 1) * 100),
        hasSubscription,
      },
    };
  };

  return profileProgress();
}

export default useProfileProgress;
