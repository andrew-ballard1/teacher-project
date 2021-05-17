import React from "react";
import styled from "styled-components";

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export const PageContainer = styled.div`
  font-family: "Quicksand", sans-serif;
  padding: 18px;
`;
export const PageContentContainer = styled.div`
  position: relative;
  margin: auto;
  max-width: 960px;
  padding: 18px;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  margin-top: 0px;
`;

/*
|--------------------------------------------------------------------------
| Panel
|--------------------------------------------------------------------------
*/

export const PanelContainer = styled.div`
  background: white;
  box-shadow: 0px 3px 6px #0000000d;
  border: 1px solid #e3eaef;
  border-radius: 4px;
  margin-bottom: 24px;
`;
export const PanelContainerHeading = styled.div`
  font-weight: 700;
  text-transform: uppercase;
  font-size: 16px;
  }
`;
export const PanelColumnsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const PanelMainColumn = styled.div`
  flex-grow: 1;
  width: 50%;
`;
export const PanelSideColumn = styled.div`
  width: 270px;
  margin-left: ${({ marginLeft }) => marginLeft && `20px`};
  margin-right: ${({ marginRight }) => marginRight && `20px`};
`;
export const PanelSection = styled.div`
  padding: 16px;
  &:not(:last-child) {
    border-bottom: 1px solid #e3eaef;
  }
`;
export const PanelSectionTitle = styled.h3`
  font-weight: 700;
  margin: 0px;
`;

export const PanelSectionHeader = styled.h4`
  font-weight: 600;
  font-size: 0.8em;
  margin: 0 0 3px;
  text-decoration: underline;
`;

/*
|--------------------------------------------------------------------------
| Form Inputs
|--------------------------------------------------------------------------
*/

export const StyledTextInput = styled.input`
  width: 100%;
  height: 36px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
  outline: none;
  border-radius: 4px;
  border: 1px solid #e3eaef;
`;
