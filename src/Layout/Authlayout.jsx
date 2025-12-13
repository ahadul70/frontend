import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
 <>
 <div>
    <Outlet></Outlet>
 </div>
 </>
  )
}

export default Authlayout