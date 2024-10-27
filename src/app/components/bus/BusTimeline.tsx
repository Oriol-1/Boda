import React from 'react';
import styles from './BusTimeline.module.css';

const BusTimeline = () => {
  const stops = [
    {
      name: "Estació d'Autobusos de Fabra i Puig (Andén 16)",
      time: "Llegada a las 10:00",
      key: "fabra-i-puig",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189.29361974513156!2d2.1829090665052897!3d41.4314369454268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4bd27e9d6852d%3A0xbfcdd71e37580e45!2sFabra%20I%20Puig!5e1!3m2!1ses!2ses!4v1730028925610!5m2!1ses!2ses",
      link: "https://maps.app.goo.gl/64F5v2THCWKrFEBAA"
    },
    {
      name: "St. Casimir (Mercat Serraperera)",
      time: "Llegada a las 10:20",
      key: "lluís-companys",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7089.825409603935!2d2.133298!3d41.494163199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4960f07a21ec1%3A0xa4963dd5df03a3fb!2sSt.%20Casimir%20(Mercat%20Serraperera)!5e1!3m2!1ses!2ses!4v1730027584278!5m2!1ses!2ses",
      link: "https://maps.app.goo.gl/fWZKTPtK8oSFnoyQ7"
    },
    {
      name: "Carrer del Mil·lenari de Catalunya, 29, 08530 La Garriga, Barcelona",
      time: "Llegar a las 11:15",
      key: "mil-lenari",
      map: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d883.753828223535!2d2.282028275931377!3d41.67469199528816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDQwJzI4LjkiTiAywrAxNic1OS43IkU!5e1!3m2!1ses!2ses!4v1730029114033!5m2!1ses!2ses",
      link: "https://maps.app.goo.gl/T7o9aAynMxvUWKZv6"
    }
  ];

  return (
    <div className={styles.container}>
      <p className={styles.title1}>Ruta del Bus</p>
      <p className={styles.title2}>Si tienen problemas para llegar a tiempo llamar por teléfono a</p>
      <p className={styles.title3}>Daniel Alonso tel: 661 10 93 92</p>
      <div className={styles.busTimelineContainer}>
        {stops.map((stop, index) => (
          <React.Fragment key={stop.key}>
            <div className={styles.stop}>
              <div className={styles.stopInfo}>
                <div className={styles.stopName}>{stop.name}</div>
                <div className={styles.stopTime} style={{fontWeight: 'bold'}}>{stop.time}</div>
                <a href={stop.link} target="_blank" className={styles.mapLink}>
                  Ver en Google Maps →
                </a>
              </div>
              <iframe
                src={stop.map}
                width="100%"
                height="400"
                style={{border: '0'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {index < stops.length - 1 && <div className={styles.arrow}>→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BusTimeline;