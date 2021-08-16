import { RouteComponentProps } from 'react-router-dom'

import {
  SectionAboutArea,
  Container,
  Row2,
  ColLg6,
  AboutContent,
  SectionTitle,
  Line,
  Title,
  TitleSpan,
  Text,
  MainBtn,
  AboutImage,
  Image,
  AboutShape,
  ShapeImg,
  ColLg6First,
  ColLg6Last,
} from 'pages/styled'

export default function TestPage({ history }: RouteComponentProps) {
  return (
    <>
      <SectionAboutArea>
        <Container>
          <Row2>
            <ColLg6>
              <AboutContent data-wow-duration="1s" data-wow-delay="0.5s">
                <SectionTitle>
                  <Line></Line>
                  <Title>
                    Quick & Easy
                    <TitleSpan> to Use Bootstrap Template</TitleSpan>
                  </Title>
                </SectionTitle>
                <Text>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seiam nonumy eirmod tempor invidunt ut labore
                  et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                  rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing.
                </Text>
                <MainBtn href=".">Try it Free</MainBtn>
              </AboutContent>
            </ColLg6>
            <ColLg6>
              <AboutImage data-wow-duration="1s" data-wow-delay="0.5s">
                <Image src="https://preview.uideck.com/items/basic/assets/images/about1.svg" alt="about"></Image>
              </AboutImage>
            </ColLg6>
          </Row2>
        </Container>
        <AboutShape>
          <ShapeImg src="https://preview.uideck.com/items/basic/assets/images/about-shape-1.svg" alt="shape"></ShapeImg>
        </AboutShape>
      </SectionAboutArea>
      <SectionAboutArea>
        <AboutShape>
          <ShapeImg src="https://preview.uideck.com/items/basic/assets/images/about-shape-2.svg" alt="shape"></ShapeImg>
        </AboutShape>
        <Container>
          <Row2>
            <ColLg6Last>
              <AboutContent data-wow-duration="1s" data-wow-delay="0.5s">
                <SectionTitle>
                  <Line></Line>
                  <Title>
                    Quick & Easy
                    <TitleSpan> to Use Bootstrap Template</TitleSpan>
                  </Title>
                </SectionTitle>
                <Text>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seiam nonumy eirmod tempor invidunt ut labore
                  et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                  rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing.
                </Text>
                <MainBtn href=".">Try it Free</MainBtn>
              </AboutContent>
            </ColLg6Last>
            <ColLg6First>
              <AboutImage data-wow-duration="1s" data-wow-delay="0.5s">
                <Image src="https://preview.uideck.com/items/basic/assets/images/about2.svg" alt="about"></Image>
              </AboutImage>
            </ColLg6First>
          </Row2>
        </Container>
      </SectionAboutArea>
      <SectionAboutArea>
        <Container>
          <Row2>
            <ColLg6>
              <AboutContent data-wow-duration="1s" data-wow-delay="0.5s">
                <SectionTitle>
                  <Line></Line>
                  <Title>
                    Quick & Easy
                    <TitleSpan> to Use Bootstrap Template</TitleSpan>
                  </Title>
                </SectionTitle>
                <Text>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seiam nonumy eirmod tempor invidunt ut labore
                  et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                  rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing.
                </Text>
                <MainBtn href=".">Try it Free</MainBtn>
              </AboutContent>
            </ColLg6>
            <ColLg6>
              <AboutImage data-wow-duration="1s" data-wow-delay="0.5s">
                <Image src="https://preview.uideck.com/items/basic/assets/images/about3.svg" alt="about"></Image>
              </AboutImage>
            </ColLg6>
          </Row2>
        </Container>
        <AboutShape>
          <ShapeImg src="https://preview.uideck.com/items/basic/assets/images/about-shape-1.svg" alt="shape"></ShapeImg>
        </AboutShape>
      </SectionAboutArea>
      <section id="counter" className="section-padding">
        <div className="overlay"></div>
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-12 col-md-12 col-xs-12">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-xs-12">
                  <div className="counter-box wow fadeInUp" data-wow-delay="0.2s">
                    <div className="icon-o">
                      <i className="lni-users"></i>
                    </div>
                    <div className="fact-count">
                      <h3>
                        <span className="counter">$1</span>
                      </h3>
                      <p>Minimum</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-xs-12">
                  <div className="counter-box wow fadeInUp" data-wow-delay="0.4s">
                    <div className="icon-o">
                      <i className="lni-emoji-smile"></i>
                    </div>
                    <div className="fact-count">
                      <h3>
                        <span className="counter">15.94 %</span>
                      </h3>
                      <p>APY</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-xs-12">
                  <div className="counter-box wow fadeInUp" data-wow-delay="0.6s">
                    <div className="icon-o">
                      <i className="lni-download"></i>
                    </div>
                    <div className="fact-count">
                      <h3>
                        <span className="counter">$1,213,435.65</span>
                      </h3>
                      <p>Market Size</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="features">
        <div className="container">
          <div className="row">
            <div className="col-md-12 heading">
              <h2 className="title">
                How Does It Works
                <span></span>
              </h2>
              <p className="subtitle">Lorem ipsum dolor sit amet consectetur</p>
            </div>
          </div>
          <div className="row multi-columns-row">
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="feature" data-sr-id="6">
                <i className="fa fa fa-database">1</i>
                <h3>Connect your wallet</h3>
                <p>Quis autem vel eum iure reprehen derit qui...Quis autem vel eum iure reprehen derit qui...</p>
              </div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="feature" data-sr-id="7">
                <i className="fa fa fa-database">2</i>
                <h3>Choose Your Investments</h3>
                <p>Quis autem vel eum iure reprehen derit qui...Quis autem vel eum iure reprehen derit qui...</p>
              </div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="feature" data-sr-id="8">
                <i className="fa fa-heart">3</i>
                <h3>You get paid</h3>
                <p>Quis autem vel eum iure reprehen derit qui...Quis autem vel eum iure reprehen derit qui...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="pricing" className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title wow fadeInDown" data-wow-delay="0.3s">
              Lorem ipsum dolor sit..
            </h2>
            <div className="shape wow fadeInDown" data-wow-delay="0.3s"></div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-xs-12">
              <div className="table wow fadeInLeft" data-wow-delay="1.2s">
                <div className="icon-box">
                  <img
                    className="img-fluid"
                    src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=966&q=80"
                    alt=""
                  ></img>
                </div>
                <div className="pricing-header">
                  <p className="price-value">Investors</p>
                </div>
                <ul className="description">
                  <li>Looking to grow your portfolio through real estate? Start with as little as $1.</li>
                </ul>
                <button className="btn btn-common">Start Investing</button>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-xs-12">
              <div className="table wow fadeInRight" data-wow-delay="1.2s">
                <div className="icon-box">
                  <img
                    className="img-fluid"
                    src="https://images.unsplash.com/photo-1600768577091-3442c3f53179?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=938&q=80"
                    alt=""
                  ></img>
                </div>
                <div className="pricing-header">
                  <p className="price-value">Borrowers</p>
                </div>
                <ul className="description">
                  <li>Do you have a passion for fix and flip projects? Put our loans to work for you.</li>
                </ul>
                <button className="btn btn-common">Submit Application</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
