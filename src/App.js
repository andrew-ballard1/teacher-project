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
    value: "maxYearsExperience"
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
          {subjects.sort((a, b) => {
            return b.yrsExp - a.yrsExp
          }).map(({ label, yrsExp }, index) => {
            return (
              <div key={index}>
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
  state = { sortBy: "alphabeticalByLastName", searchBy: "", level:{nursery: false, lower: false, middle: false, upper: false} };

  handleSortBy = (option) => {
    this.setState({sortBy: option.value})
  }

  handleTextSearch = (text) => {
    this.setState({searchBy: text})
  }

  buildTeacherList = () => {
    const { sortBy, searchBy, level, level: {nursery, lower, middle, upper} } = this.state

    const selectedFilters = Object.entries(level).filter(([filter, value]) => {
      if(value){
        return true
      }
    }).map(([key, val]) => {
      return key
    })

    const teachers = teacherData.sort((a, b) => {
      // filters
      // yearsExp
      // alphabetical (last)
      if(sortBy === "maxYearsExperience"){
        let maxYrsA = a.subjects.reduce((acc, curr) => {
          return {yrsExp: acc.yrsExp + curr.yrsExp}
        }, {yrsExp: 0})
        let maxYrsB = b.subjects.reduce((acc, curr) => {
          return {yrsExp: acc.yrsExp + curr.yrsExp}
        }, {yrsExp: 0})
        
        return maxYrsB.yrsExp - maxYrsA.yrsExp
      } else if(sortBy === "alphabeticalByLastName"){
        if(a.lastName.toLowerCase() < b.lastName.toLowerCase()){
          return -1
        }
        if(a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
          return 1
        }
        return 0
      }
    }).filter((teacher) => {
      // handle checkbox, state, text search here
      let returnVal = true
      if(searchBy !== ""){
        returnVal = false
        let teacherName = `${teacher.firstName} ${teacher.lastName}`
        if(teacherName.toLowerCase().indexOf(searchBy.toLowerCase().trim()) !== -1){
          returnVal = true
        }
        if(teacher.subjects.filter((subject) => {
          if(subject.label.toLowerCase().indexOf(searchBy.toLowerCase().trim()) !== -1){
            return true
          } else {
            return false
          }
        }).length > 0){
          returnVal = true
        }
      } else {
        returnVal = true
      }

      // if any filters are selected
      if(returnVal && Object.values(level).some((item) => item == true)){
        returnVal = false

        return selectedFilters.every((item) => {
          if(teacher.gradeLevelsTaught[item]){
            return true
          }
          return false
        })
      }

      return returnVal
    }).map((teacher, index) => (
      <TeacherCard key={index} teacher={teacher} />
    ))

    return teachers
  }

  setGradeFilter = async ({levels = [], value}) => {
    let mutableState = Object.assign({}, this.state)
    for(var item of levels){
      let change = {
        level: {
          ...this.state.level,
          [item]: value
        }
      }
      let newState = Object.assign(mutableState, change)
      await this.setState({...newState})
    }
  }

  render() {
    const { sortBy, level: {lower, middle, upper} } = this.state;

    const teacherList = this.buildTeacherList()
    const showScrollToTop = teacherList.length >= 2

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
                  <StyledTextInput onKeyUp={(event) => this.handleTextSearch(event.target.value)}/>
                </PanelSection>
                <PanelSection>
                  <PanelSectionTitle>Sort By</PanelSectionTitle>
                </PanelSection>
                <PanelSection>
                  <Select
                    value={sortByOptions.find(({ value }) => value === sortBy)}
                    options={sortByOptions}
                    onChange={this.handleSortBy}
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
                  <input type="checkbox" onChange={event => this.setGradeFilter({levels: ['nursery', 'lower'], value: !lower})}/>
                    <label>Nursery & Lower School</label>
                    {/* at some point this can be expanded. 
                    The whole 'setGradeFilter' function can handle multiple values - 
                    which now that I think about it, was probably a waste of time.
                    I could have broken up these checkboxes into two separate categories. 
                    There's probably no case where we want different filters with 3-5 categories each. 
                    Maybe on another filter, like school districts taught in */}
                  </div>
                  <div>
                    <input type="checkbox" onChange={event => this.setGradeFilter({levels: ['middle'], value: !middle})}/>
                    <label>Middle-School</label>
                  </div>
                  <div>
                    <input type="checkbox" onChange={event => this.setGradeFilter({levels: ['upper'], value: !upper})}/>
                    <label>High-School</label>
                  </div>
                </PanelSection>
              </PanelContainer>
            </PanelSideColumn>
            <PanelMainColumn>
              {this.buildTeacherList()}
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
