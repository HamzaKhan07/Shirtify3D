/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import CustomButton from './CustomButton';

const FilePicker = (props) => {
  return (
    <div className='filepicker-container'>
      <div className='flex-1 flex flex-col'>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(ev) => props.setFile(ev.target.files[0])}
        />
        <label htmlFor='file-upload' className="filepicker-label">
          Upload File
        </label>

        <p className="mt-3 text-gray-500 text-xs truncate">
          {props.file === ''  ? 'No file selected' : props.file.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={()=> props.readFile('logo')}
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={()=> props.readFile('full')}
          customStyles="text-xs"
        />
      </div>
    </div>
  )
}

export default FilePicker