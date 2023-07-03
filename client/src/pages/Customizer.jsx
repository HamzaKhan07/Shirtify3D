/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../state';
import {download} from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';

import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
  const snap=useSnapshot(state);
  const downloadTab= {
    name: "donwload",
    icon: download,
  }

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  function generateTabContent(){
    switch(activeEditorTab){
      case "colorpicker":
        return <ColorPicker/>
      case "filepicker":
        return <FilePicker 
        file={file} 
        setFile={setFile}
        readFile={readFile}
        />
      case "aipicker":
        return <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  } 

  async function handleSubmit(type){
    if(!prompt){
      return alert("Please enter a prompt");
    } 

    try{
      //call out backend to generate ai image
      setGeneratingImg(true);
      console.log(prompt);

      const response = await fetch('http://localhost:3000/api/v1/dalle', {
        method: 'POST',
        body: JSON.stringify({prompt}),
        headers: {'Content-Type': 'application/json'}
      })

      const data = await response.json();

      handleDecals(type, `data:image/png;base64, ${data.photo}`);

    }catch(error){
      alert(error);
    }
    finally{
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  function handleDecals(type, result){
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  function handleActiveFilterTab(tabName){
    switch(tabName){
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
      break;
    }

    //after the filer
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
      [tabName]: !prevState[tabName]
      }
    })

  }

  function readFile(type){
    reader(file).then(result => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div 
            key="custom"
            className="absolute top-0 left-0 z-10" 
            {...slideAnimation('left')}
          >

          <div className="flex items-center min-h-screen">
            <div className="editortabs-container tabs">
              {EditorTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isActiveTab=""
                  handleClick={()=>{setActiveEditorTab(activeEditorTab==='' ? tab.name : '')}}
                />
              ))}

              {generateTabContent()}

            </div>
          </div>
          </motion.div>

          <motion.div className="absolute z-10 top-5 right-5"
          {...fadeAnimation}>

          <CustomButton
            type="filled"
            title="Go Back"
            handleClick={()=> state.intro=true}
            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
          ></CustomButton>

          </motion.div>

          <motion.div className="filtertabs-container" 
          {...slideAnimation('up')}>

            {FilterTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    isFilterTab="true"
                    isActiveTab={activeFilterTab[tab.name]}
                    handleClick={()=> handleActiveFilterTab(tab.name)}
                  />
              ))} 

              {/* download */}
              <div className="download">
                <Tab
                  key="download"
                  tab={downloadTab}
                  isFilterTab="true"
                  handleClick={downloadCanvasToImage}
                />
              </div>
              

          </motion.div>

        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer