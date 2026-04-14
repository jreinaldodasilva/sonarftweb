import React from 'react';

function Validators(props) {
  return (
    <li>
      {props.validator.title}: {props.validator.value}
      <button onClick={() => props.deleteValidator(props.validator.id)}>Remove</button>
    </li>
  );
}


export default Validators;
