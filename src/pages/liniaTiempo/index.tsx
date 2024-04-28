'use client';

import TimelineBoda from "@/app/components/timelineBoda/timelineBoda";
import Image from 'next/image';

const LiniDeTiempo = () => {
    return (
      <div>
       <h1 className="text-center text-5xl font-sans my-5">
      <b> ¡Vamos a celebrarlo!</b><br></br> Aquí el plan para nuestro gran día
        </h1>
         <Image src="/Logo5.svg" alt="Logo" width={100} height={100} style={{ width: '180px', height: 'auto',textAlign: 'center'
          , marginLeft: 'auto', marginRight: 'auto' }} />
        <TimelineBoda />
      </div>
    );
  };
  
  export default LiniDeTiempo;