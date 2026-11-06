import { money } from '@/pages/Afribid/constants';
import React from 'react';

interface Props {
  cents: number | null | undefined;
  showCurrency?: boolean;
  className?: string;
}

const Money: React.FC<Props> = ({
  cents,
  showCurrency = true,
  className = 'money',
}) => {
  if (cents == null) {
    return <span className={className}>Price on request</span>;
  }
  return (
    <span className={className}>
      {showCurrency ? <small>USD </small> : null}
      {money(cents)}
    </span>
  );
};

export default Money;
