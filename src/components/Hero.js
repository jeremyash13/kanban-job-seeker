import React from "react"
import SimpleSeekLogoLanding from "./SimpleSeekLogoLanding"
import MacOsImg from "../images/macos-img.png"
import CallToAction from "./CallToAction"

function Hero() {
  return (
    <div className="hero-img relative">
      <SimpleSeekLogoLanding />
      <div className="hero-overlay absolute inset-0"></div>
      <div className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex">
        <div className="max-w-lg my-auto pr-4">
          <h3 className="text-white">Welcome to Simple Seek.</h3>
          <p>
            Simple Seek’s Kanban-style board keeps track of all your job
            applications, job interviews, and job offers, so you can focus on
            what’s most important —finding the perfect company for you.{" "}
          </p>
          <CallToAction />
        </div>
        <div className="">
          <img
            className="rounded"
            src={MacOsImg}
            alt="simple seek app screenshot"
          />
        </div>
      </div>
      <div className="absolute bottom-0 hero-wavy transform translate-y-3 w-full">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 238"
        >
          <g>
            <path
              fill="white"
              d="M1920,38.2V238H0V0c299.2,195,756.8,192.7,1036,109.3C1263.6,41.3,1646.8-53.7,1920,38.2z"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default Hero
