import React from "react";

const Filter = ({ onChange }) => (
  <div>
    Rajaa näytettäviä: <input onChange={onChange} />
  </div>
);

export default Filter;
