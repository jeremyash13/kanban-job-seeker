import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useAuth } from "react-use-auth"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/Hero"

import img1 from "../images/drag n drop.png"
import img2 from "../images/add job.png"
import img3 from "../images/add note interview.png"

const IndexPage = () => {
  const { isAuthenticated } = useAuth()
  const isBrowser = typeof window !== `undefined`

  if (isAuthenticated() && isBrowser) {
    // need to check if Window Object is defined when calling navigate() or build will fail
    navigate("/app")
    return null
  } else {
    return (
      <Layout>
        <SEO title="Get Started" />
        <Hero />
        <div className="flex flex-col mt-10 text-flatblack px-4">
          <div className="flex flex-col sm:flex-row mx-auto mt-10">
            <div className="max-w-sm min-w-256 my-auto">
              <h3 className="text-flatblack">Drag and drop.</h3>
              <p>
                Simple Seek’s drag and drop interface makes managing your job
                hunt a breeze.
              </p>
            </div>
            <div className="max-w-sm sm:ml-10">
              <img className="rounded" src={img1}></img>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row mx-auto mt-32">
            <div className="max-w-sm sm:mr-10">
              <img className="rounded" src={img2}></img>
            </div>
            <div className="max-w-sm min-w-256 my-auto">
              <h3 className="text-flatblack">Track your applications.</h3>
              <p>
                Tracking a new job is as simple as clicking the “New” button,
                and providing some details.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row mx-auto mt-32">
            <div className="max-w-sm min-w-256 my-auto">
              <h3 className="text-flatblack">Add notes.</h3>
              <p>
                Keeping track of the details couldn’t be easier.
              </p>
            </div>
            <div className="max-w-sm sm:ml-10">
              <img className="rounded" src={img3}></img>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
export default IndexPage
