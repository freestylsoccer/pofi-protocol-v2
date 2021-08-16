import styled from 'styled-components/macro'

export const StandardPageWrapper = styled.div`
  padding-top: 160px;
  width: 100%;
`

export const IframeBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 3rem;
  padding: 1rem;
  align-items: center;
  flex: 1;
  z-index: 1;
`

export const SectionAboutArea = styled.section`
  display: block;
  position: relative;
  z-index: 5;
  padding-top: 70px;
`
export const Container = styled.div`
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  @media (min-width: 576px) {
    .container {
      max-width: 540px;
    }
  }
  @media (min-width: 768px) {
    .container {
      max-width: 720px;
    }
  }
  @media (min-width: 992px) {
    .container {
      max-width: 960px;
    }
  }
  @media (min-width: 1200px) {
    .container {
      max-width: 1140px;
    }
  }
`

export const Row2 = styled.div`
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`
export const ColLg6 = styled.div`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  @media (min-width: 992px) {
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }
`
export const AboutContent = styled.div`
  max-width: 480px;
  margin-top: 50px;
`
export const SectionTitle = styled.div``

export const Line = styled.div`
  background: -webkit-linear-gradient(#fe8464 0%, #fe6e9a 100%);
  background: -o-linear-gradient(#fe8464 0%, #fe6e9a 100%);
  background: linear-gradient(#fe8464 0%, #fe6e9a 100%);
  width: 150px;
  height: 5px;
  margin-bottom: 10px !important;
`
export const Title = styled.h3`
  font-size: 32px;
  padding-top: 10px;
  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    font-size: 30px;
  }
  @media (max-width: 767px) {
    font-size: 24px;
  }
  @media only screen and (min-width: 576px) and (max-width: 767px) {
    font-size: 30px;
  }
`
export const TitleSpan = styled.h3`
  font-weight: 400;
  display: contents;
`
export const Text = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  margin-top: 15px;
`
export const MainBtn = styled.a`
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0 25px;
  font-size: 16px;
  line-height: 48px;
  border-radius: 8px;
  border: 0;
  color: #fff;
  cursor: pointer;
  z-index: 5;
  -webkit-transition: all 0.4s ease-out 0s;
  -moz-transition: all 0.4s ease-out 0s;
  -ms-transition: all 0.4s ease-out 0s;
  -o-transition: all 0.4s ease-out 0s;
  transition: all 0.4s ease-out 0s;
  background: -webkit-linear-gradient(left, #33c8c1 0%, #119bd2 50%, #33c8c1 100%);
  background: -o-linear-gradient(left, #33c8c1 0%, #119bd2 50%, #33c8c1 100%);
  background: linear-gradient(to right, #33c8c1 0%, #119bd2 50%, #33c8c1 100%);
  background-size: 200%; }
  :hover {
    color: #fff;
    background-position: right center; }
  background: -webkit-linear-gradient(left, #fe8464 0%, #fe6e9a 50%, #fe8464 100%);
  background: -o-linear-gradient(left, #fe8464 0%, #fe6e9a 50%, #fe8464 100%);
  background: linear-gradient(to right, #fe8464 0%, #fe6e9a 50%, #fe8464 100%);
  background-size: 200%;
  height: 50px;
  line-height: 50px;
  padding: 0 35px;
  margin-top: 40px;
  :hover {
    background-position: right center;
  }
`
export const AboutImage = styled.div`
  margin-top: 50px;
  text-align: center !important;
`
export const Image = styled.img`
  vertical-align: middle;
  border-style: none;
  max-width: 100%;
`
export const AboutShape = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 35%;
  height: 100%;
  z-index: -1;
  @media (max-width: 767px) {
    display: none;
  }
`
export const ShapeImg = styled.div`
  width: 100%;
  vertical-align: middle;
  max-width: 100%;
  border-style: none;
`
export const ColLg6First = styled.div`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  @media (min-width: 992px) {
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
    -ms-flex-order: -1;
    order: -1;
  }
`
export const ColLg6Last = styled.div`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  @media (min-width: 992px) {
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
    -ms-flex-order: 13;
    order: 13;
  }
`
