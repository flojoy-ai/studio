import { lightTheme, darkTheme } from './../theme';

const customDropdownStyles = {
    menu: (provided, state) => ({
        ...provided,
        opacity: 1,
        backgroundColor: state.selectProps.theme === 'dark' 
          ? darkTheme.body 
          : lightTheme.body,
        color: state.selectProps.theme === 'dark' 
          ? darkTheme.text 
          : lightTheme.text,
      }),
  
      control: (provided, state) => ({
        ...provided,
        cursor: 'pointer',
        border: 0,
        outline: 0,
        backgroundColor: state.selectProps.theme === 'dark' 
          ? darkTheme.body 
          : lightTheme.body,
        color: state.selectProps.theme === 'dark' 
          ? darkTheme.text 
          : lightTheme.text,        
      }),
  
      option: (styles, { selectProps, isFocused, isSelected }) => {
        return {
          ...styles,
          cursor: 'pointer',
          backgroundColor: isSelected
          ? selectProps.theme === 'dark' ? 'black' : '#ccc'
          : isFocused
          ? selectProps.theme === 'dark' ? 'black' : '#ccc'
          : undefined,
          ':active': {
            ...styles[':active'],
            }
        }
      },    
    
      singleValue: (provided, state) => {
        const color = state.selectProps.theme === 'dark' 
          ? darkTheme.text 
          : lightTheme.text;
    
        return { ...provided, color };
      }    
    }    

export default customDropdownStyles;