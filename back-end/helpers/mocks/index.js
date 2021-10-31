module.exports = {
  userMaker
}

const user = {
  email: null,
  first_name: null,
  last_name: null,
  public_email: null,
  profile_image: null,
  avatar_image: null,
  area_of_work: null,
  desired_title: null,
  summary: null,
  current_location_lat: null,
  current_location_lon: null,
  current_location_name: null,
  twitter: null,
  github: null,
  linkedin: null,
  portfolio: null,
  top_skills_prev: null,
  additional_skills_prev: null,
  stripe_customer_id: null,
  stripe_subscription_name: null,
};

function userMaker(props) {
  return {
    ...user, ...props
  }
}