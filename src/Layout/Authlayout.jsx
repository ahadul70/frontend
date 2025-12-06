import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
 <>
 <h1>This is the Authlayout</h1>
 <div>
    <Outlet></Outlet>
 </div>
 </>
  )
}

export default Authlayout