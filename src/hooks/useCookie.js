import { useState } from "react"
import ObjectID from "bson-objectid"

const isBrowser = typeof window !== `undefined`

const checkCookie = () => {
  if (isBrowser) {
    return document.cookie.includes("userID=")
  }
}

const getUserId = () => {
  if (isBrowser) {
    const cookieStr = document.cookie.split(";")[0]
    const userId = cookieStr.slice(cookieStr.indexOf("=") + 1, cookieStr.length)
    return userId
  }
}

const createCookie = () => {
  if (isBrowser) {
    const newUserId = ObjectID().toString()
    document.cookie = `userID=${newUserId};expires=Sun, 31 Dec 6969 10:59:59 GMT;path=/`
  }
}

export default function () {
  const isFound = checkCookie()
  const newCookie = createCookie
  const getUser = getUserId
  return {
    isFound,
    newCookie,
    getUser,
  }
}
