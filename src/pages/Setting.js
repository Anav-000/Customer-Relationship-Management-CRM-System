import React, { useState } from 'react';

const Setting = () => {
  const [logoDark, setLogoDark] = useState(null);
  const [logoLight, setLogoLight] = useState(null);
  const [favicon, setFavicon] = useState(null);

  const handleLogoDarkChange = (event) => {
    setLogoDark(event.target.files[0]);
  };

  const handleLogoLightChange = (event) => {
    setLogoLight(event.target.files[0]);
  };

  const handleFaviconChange = (event) => {
    setFavicon(event.target.files[0]);
  };

  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Brand Settings</h2>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Logo Dark</h3>
          <input type="file" className="border p-2 rounded-md" onChange={handleLogoDarkChange} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Logo Light</h3>
          <input type="file" className="border p-2 rounded-md" onChange={handleLogoLightChange} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Favicon</h3>
          <input type="file" className="border p-2 rounded-md" onChange={handleFaviconChange} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Title Text</h3>
        <input type="text" className="border p-2 rounded-md w-full" placeholder="HisabMitra" />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Footer Text</h3>
        <input type="text" className="border p-2 rounded-md w-full" placeholder="Copyright © hisabmitra" />
      </div>

      <h2 className="text-xl font-semibold mt-8">Theme Customizer</h2>

      <div className="grid grid-cols-5 gap-4 mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">Primary Color Settings</h3>
          <div className="flex space-x-2">
            <div className="w-5 h-5 rounded-full bg-blue-500"></div>
            <div className="w-5 h-5 rounded-full bg-green-500"></div>
            <div className="w-5 h-5 rounded-full bg-red-500"></div>
            <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
            <div className="w-5 h-5 rounded-full bg-purple-500"></div>
          </div>
        </div>

        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">Sidebar Settings</h3>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">Transparent Layout</span>
          </label>
        </div>

        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">Layout Settings</h3>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">Dark Layout</span>
          </label>
        </div>

        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">Enable RTL</h3>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">RTL Layout</span>
          </label>
        </div>

        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">Category Wise Sidemenu</h3>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">Category Wise Sidemenu</span>
          </label>
        </div>
      </div>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">
        Save Changes
      </button>
    </div>
    </>
  );
};

export default Setting;