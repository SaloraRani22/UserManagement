import React from 'react'
import Appbar from '../components/Appbar'
import { Outlet } from "react-router-dom";
export default function UserLayout() {
  return (
    <div>
      <Appbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}