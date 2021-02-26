import React from "react";

function UserSummary({ userId, summary }) {
  return (
    <div id={`profile-${userId}-summary`} className="summary">
      {summary ? <p>{summary}</p> : <p>No Summary Listed</p>}
    </div>
  );
}

export default UserSummary;
