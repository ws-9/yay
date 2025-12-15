import { useState } from 'react';
import { Link } from 'react-router';
import MainSidebar from './MainSidebar';

export default function Chat() {
  return (
    <div className="grid min-h-screen grid-cols-[1fr] sm:grid-cols-[15rem_1fr] lg:grid-cols-[15rem_1fr_15rem]">
      <MainSidebar />
      <p>chat</p>
      <div className="hidden bg-gray-300 lg:block">Secondary bar</div>
    </div>
  );
}
