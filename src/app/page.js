'use client';

import { useState, useEffect } from 'react';
 
import MainContent from './home/page';
export default function Home() {
  return (
    
   <div>
    <div className='flex justify-center items-center h-screen'>

    <MainContent></MainContent>
    </div>
   </div>
  );
}
