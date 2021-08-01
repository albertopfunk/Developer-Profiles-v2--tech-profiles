import React from "react"
import styled from "styled-components";
import { ReactComponent as ErrorPage } from "../../../global/assets/page-not-found.svg";

import Spacer from "../../../global/helpers/spacer";

function DashboardNotFound() {
    return (
        <NotFoundSection>
            <h2>Dashboard Page Not Found</h2>
            <Spacer size="20" axis="vertical" />
            <ErrorPage className="page-icon" />
        </NotFoundSection>
    );
}

const NotFoundSection = styled.section`
    text-align: center;
    width: 100%;
    max-width: 750px;
`;

export default DashboardNotFound