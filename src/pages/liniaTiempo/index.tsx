'use client';

import TimelineBoda from "@/app/components/timelineBoda/timelineBoda";

const LiniDeTiempo = () => {
    return (
      <div>
        <h1 
        style={{textAlign: 'center',  fontSize: '50px', fontFamily: 'Arial', marginTop: '20px', marginBottom: '20px'}}
        >Timeline de Nuestra Boda</h1>
        <TimelineBoda />
      </div>
    );
  };
  
  export default LiniDeTiempo;