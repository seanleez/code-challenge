import { TCurrency } from '../../type';
import { CURRENCIES } from '../../const';
import React from 'react';
import './currency-dropdown.style.scss';
import { SVGIcon } from '../svg-icon';
import { Dropdown } from 'react-bootstrap';

export interface ICurrencyDropdownProps {
  selectedCurrency: TCurrency;
  currenciesList?: TCurrency[];
  onSelectCurrency: (currency: TCurrency) => void;
}

const classNamePrefix = 'currency-dropdown';

export const CurrencyDropdown: React.FC<ICurrencyDropdownProps> = (props) => {
  const { selectedCurrency, currenciesList = CURRENCIES, onSelectCurrency } = props;

  return (
    <Dropdown className={classNamePrefix}>
      <Dropdown.Toggle variant="dark" id="currency-dropdown">
        <SVGIcon name={selectedCurrency.currency} />
        {selectedCurrency.currency}
      </Dropdown.Toggle>

      <Dropdown.Menu className={`${classNamePrefix}__menu`}>
        {currenciesList
          .sort((a, b) => a.currency.localeCompare(b.currency))
          .map((cur, index) => (
            <Dropdown.Item key={index} onClick={() => onSelectCurrency(cur)}>
              {cur.currency}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
