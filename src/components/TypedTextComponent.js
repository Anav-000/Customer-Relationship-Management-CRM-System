import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypedTextComponent = () => {
  const typedRef = useRef(null); // Use ref to attach the Typed.js instance to an element

  useEffect(() => {
    const options = {
      strings: [
        'Manage Sales, Contacts, and Projects – All with AdvertCRM Intuitive CRM',
        'Manage Sales, Contacts, and Projects with EasTrack Performance, Automate Tasks, and Scale Your Business with Ease.',
        'Experience Seamless Integration and Collaboration with AdvertCRM – Your Ultimate CRM Solution.'
      ],
      typeSpeed: 50, // Speed of typing in ms
      backSpeed: 30, // Speed of backspacing in ms
      backDelay: 1000, // Delay before backspacing starts in ms
      loop: true, // Whether to loop the typing animation
    };

    // Initialize Typed.js
    const typed = new Typed(typedRef.current, options);

    // Cleanup when the component unmounts
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <h1>
        <span ref={typedRef} />
      </h1>
    </div>
  );
};

export default TypedTextComponent;
