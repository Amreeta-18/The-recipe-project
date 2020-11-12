import React from 'react'

function SearchBar({onSubmit, queryString, setQueryString}) {

  const handleTextChange = (e) => {
    setQueryString(e.target.value)
  }

  return (

 <div className='form-container'>
    <form onSubmit={onSubmit}>
      <input onChange={handleTextChange} type='text' id="test_search_bar_input" className='search-bar' placeholder='Enter ingredients here...' defaultValue={queryString}/>
      <button type='submit' id="test_search_bar_submit_button" className='searchbutton'>
        &#xf002;
      </button>
      <style jsx='true'>
        {`
        .form-container{
          width: 90%;
          display: flex;
         justify-content: center;
        }
        .search-bar {
          font-family: system-ui, 'Font Awesome 5 Free';
          font-size: 20px;
          width: 118%;
          height: 30px;
          z-index: 1;
          padding: 0px 75px;
          border-radius: 20px;
          border: 3.5px solid #D2AE69;
          filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
          max-width: 640px;
    
        }

        .searchbutton {
          z-index: 1;
          position: relative;
          top: -31px;
         //left: -268px;
          font-family: 'Font Awesome 5 Free';
          background-color: rgba(243, 220, 159, 0.8);
          border: 2px solid #e7e7e7;
          border-radius: 20px;
          color: black;
          height: 25px;
          width: 45px;     
          //text-align: center;
          text-decoration: none;
          //display: inline-block;
          font-size: 16px;
                // float: right;
          //right: -224px;
          //left:418px;
          justify-content: flex-end;
          left: 591px;

        }
        

        `}
      </style>
    </form>
    </div>
  )
}

export default SearchBar
