import Select, { components as Components } from "react-select";
import styled from "styled-components";
import './MultiSelect.css';

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 14px;
`;

const Value = styled.div`
  padding: 0.5rem 0.5rem 0.1rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  font-size: 0.75rem;
  color: #fff;
  background-color: #ba5b37;
  border-radius: 1rem;
  user-select: none;
`;

const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: #fff;
  transition: fill 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #bb392d;
  }
  &:focus {
    color: #c82f21;
  }
`;

const MultiSelect = (props) => {
  const { isMulti, value, onChange } = props;

  const handleRemoveValue = (e) => {
    if (!onChange) return;
    const { name: buttonName } = e.currentTarget;
    const removedValue = value.find((val) => val.value === buttonName);
    if (!removedValue) return;
    onChange(
      value.filter((val) => val.value !== buttonName),
      { name: buttonName, action: "remove-value", removedValue }
    );
  };

  return (
    <div>
      <ValuesContainer>
        {isMulti
          ? value.map((val) => (
              <Value key={val.value}>
                {val.label}
                <XButton name={val.value} onClick={handleRemoveValue}>
                  ✕
                </XButton>
              </Value>
            ))
          : null}
      </ValuesContainer>
      <Select {...props} className="select-div" controlShouldRenderValue={!isMulti} />
    </div>
  );
};

export default MultiSelect;
