'use client';

import TimelineBoda from "@/app/components/timelineBoda/timelineBoda";
import Image from 'next/image';

const LiniDeTiempo = () => {
    return (
      <div>
        <h1 
        style={{textAlign: 'center',  fontSize: '50px', fontFamily: 'Arial', marginTop: '20px', marginBottom: '20px'}}
        >Timeline de Nuestra Boda</h1>
         <Image src="/Logo2.svg" alt="Logo" width={100} height={100} style={{ width: '180px', height: 'auto',textAlign: 'center'
          , marginLeft: 'auto', marginRight: 'auto' }} />
        <TimelineBoda />
      </div>
    );
  };
  
  export default LiniDeTiempo;