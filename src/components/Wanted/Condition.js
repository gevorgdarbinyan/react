import React, { Component } from "react";
var Translate = require("react-redux-i18n").Translate;

export default class Condition extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {
      displayDropdown: false,
      searchTerm: ""
    };
  }
  handleInputChange = e => {
    this.setState({ searchTerm: e.target.value });
  };
  handleClick = () => {
    if (!this.state.displayDropdown) {
      // attach/remove event handler
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      displayDropdown: !prevState.displayDropdown
    }));
  };

  handleOutsideClick = e => {
    // ignore clicks on the component itself
    if (this.node.contains(e.target) || this.inputNode.contains(e.target)) {
      return;
    }

    this.handleClick();
  };

  render = () => {
    const conditionList = this.props.listingProperties.conditions;
    const data = this.props.data.condition;

    return (
      <div className="row">
        <div className="input-field-block">
          <div className="form-group field-material-wanted">
            <div className="title-block">
              <label className="control-label">
                <Translate value="common.condition" />
              </label>
              <div className="help-block"></div>
            </div>
            <div className="select-wrapper">
              <input
                className="select-dropdown"
                type="text"
                readOnly={true}
                required={true}
                onClick={this.handleClick}
                value={data.label}
              />
              {this.renderConditionList(conditionList)}
            </div>
          </div>
        </div>
      </div>
    );
  };
  renderConditionList(conditionList) {
    let list = [];

    list.push({
      value: null,
      label: "All",
      isHeader: false,
      isSubItem: false
    });

    conditionList.items.forEach(item => {
      list.push({ label: item.label, isHeader: true, isSubItem: false });
      item.items.forEach(itm => {
        list.push({
          value: itm.value,
          label: itm.label,
          isHeader: false,
          isSubItem: true
        });
      });
    });

    const result = list.filter(
      item =>
        !item.isHeader &&
        this.state.searchTerm !== "" &&
        item.label
          .toLowerCase()
          .includes(this.state.searchTerm.toLocaleLowerCase())
    );
    return this.renderConditionDropdown(result.length > 0 ? result : list);
  }

  renderConditionDropdown = list => {
    const style = this.state.displayDropdown
      ? { display: "block" }
      : { display: "none" };

    return (
      <ul
        className="wanted-create-dropdown multiple-select-dropdown"
        style={style}
      >
        <input
          type="text"
          placeholder="Search"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          ref={inputNode => {
            if (inputNode) this.inputNode = inputNode;
          }}
        />
        <div>
          {list.map((item, index) => (
            <li
              key={index}
              onClick={e => {
                if (!item.isHeader) this.props.onChange("condition", item);
              }}
              ref={node => {
                if (node) this.node = node;
              }}
            >
              <span>
                <label>
                  {item.isSubItem ? <span>&emsp;</span> : null}
                  <span style={item.isHeader ? { color: "black" } : null}>
                    {item.label}
                  </span>
                </label>
              </span>
            </li>
          ))}
        </div>
      </ul>
    );
  };
}
