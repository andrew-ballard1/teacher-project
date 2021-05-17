import React from "react";
import styled from "styled-components";
import { startCase } from "lodash";
import "./index.css";
import {
  PageContainer,
  PageContentContainer,
  PageTitle,
  PanelContainer,
  PanelColumnsContainer,
  PanelMainColumn,
  PanelSideColumn,
  PanelSection,
  PanelSectionTitle,
  StyledTextInput,
  PanelSectionHeader
} from "./StyledComponents";
import Select from "react-select";
import teacherData from "./teacherData";
import { animateScroll as scroll } from "react-scroll";
import ZipCodes from 'zipcodes';

/*
|--------------------------------------------------------------------------
| Variables / helpers
|--------------------------------------------------------------------------
*/

const sortByOptions = [
  {
    label: "Alphabetical (last name)",
    value: "alphabeticalByLastName"
  },
  {
    label: "Years experience (max)",
    vale: "maxYearsExperience"
  }
];

const getCityState = (zip) => {
  let locale = ZipCodes.lookup(zip);
  let {city, state} = locale;

  return {city, state};
}

/*
|--------------------------------------------------------------------------
| Stateless Components
|--------------------------------------------------------------------------
*/

const TeacherCard = ({ teacher }) => {
  const { firstName, lastName, zipCode, subjects, gradeLevelsTaught } = teacher;
  const { city, state } = getCityState(zipCode);

  return (
    <PanelContainer>
      <PanelSection>
        <PanelSectionTitle>
          {firstName} {lastName}
        </PanelSectionTitle>
      </PanelSection>
      <PanelSection>{city}, {state}</PanelSection>
      <PanelSection>
        <PanelSectionHeader>Grades Levels</PanelSectionHeader>
        <div style={{ marginBottom: "16px" }}>
          {Object.keys(gradeLevelsTaught)
            .map((level) => startCase(level))
            .join(", ")}
        </div>
        <div>
          <PanelSectionHeader>Subjects</PanelSectionHeader>
          {subjects.map(({ label, yrsExp }) => {
            return (
              <div>
                {label}, {yrsExp} years exp.
              </div>
            );
          })}
        </div>
      </PanelSection>
    </PanelContainer>
  );
};

/*
|--------------------------------------------------------------------------
| React Component
|--------------------------------------------------------------------------
*/

export default class App extends React.Component {
  state = { sortBy: "alphabeticalByLastName" };
  render() {
    const { sortBy } = this.state;
    return (
      <PageContainer>
        <PageContentContainer>
          <PageTitle>Teacher Search</PageTitle>
          <PanelColumnsContainer>
            <PanelSideColumn marginRight>
              <PanelContainer>
                <PanelSection>
                  <PanelSectionTitle>Text Search</PanelSectionTitle>
                </PanelSection>
                <PanelSection>
                  <StyledTextInput />
                </PanelSection>
                <PanelSection>
                  <PanelSectionTitle>Sort By</PanelSectionTitle>
                </PanelSection>
                <PanelSection>
                  <Select
                    value={sortByOptions.find(({ value }) => value === sortBy)}
                    options={sortByOptions}
                  />
                </PanelSection>
                <PanelSection>
                  <PanelSectionTitle>Filters</PanelSectionTitle>
                </PanelSection>
                <PanelSection>
                  <label style={{ display: "block", marginBottom: "14px" }}>
                    Grade Levels
                  </label>
                  <div>
                    <input type="checkbox" />
                    <label>Nursery & Lower School</label>
                  </div>
                  <div>
                    <input type="checkbox" />
                    <label>Middle-School</label>
                  </div>
                  <div>
                    <input type="checkbox" />
                    <label>High-School</label>
                  </div>
                </PanelSection>
              </PanelContainer>
            </PanelSideColumn>
            <PanelMainColumn>
              {teacherData.map((teacher) => (
                <TeacherCard teacher={teacher} />
              ))}
              <button
                onClick={() => {
                  scroll.scrollToTop({
                    duration: 1600,
                    delay: 100,
                    smooth: true
                  });
                }}
              >
                Scroll To Top
              </button>
            </PanelMainColumn>
          </PanelColumnsContainer>
        </PageContentContainer>
      </PageContainer>
    );
  }
}

/*
|--------------------------------------------------------------------------
| React Component
|--------------------------------------------------------------------------
*/
