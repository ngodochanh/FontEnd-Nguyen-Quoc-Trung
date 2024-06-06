interface WalletBalance {
  currency: string;
  amount: number;
} // định nghĩa cấu trúc dữ liệu

// FormattedWalletBalance có thể kế thừa WalletBalance (vì có thuộc tính currency và amount cùng kiểu dữ liệu)
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// Props kế thừa BoxProps (có thể import từ ngoài) nhưng lại không thêm thuộc tính.
interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances(); // lấy thông tin về số dư ví tiền của người dùng
  const prices = usePrices(); // lấy thông tin về giá cả của các loại tiền tệ hoặc tài sản khác

  // blockchain nên khai báo là kiểu dữ liệu string (vì các case có kiểu string) và hàm này có thể sử dụng useCallback để tránh render không cần thiết
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa': // cả Zilliqa và Neo đều return về 20
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  }; // mức độ ưu tiên của blockchain đó.

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // khai báo biến balancePriority nhưng không thấy sử dụng và balance khi khai báo thuộc tính thì không thấy có blockchain (có lẽ thay bằng currency)
        const balancePriority = getPriority(balance.blockchain);
        // biến lhsPriority này lấy từ đâu có lẽ là thay bằng balancePriority và có thể dùng cách tắt để viết return
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // lhs và rhs khi khai báo thuộc tính thì không thấy có blockchain (có lẽ thay bằng currency)
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // thếu else (trường hợp === ) return 0 và có thể dùng cách tắt để viết return
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]); // sắp xếp balances giảm dần

  // Không thấy biến formattedBalances được sử dụng
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  }); // thêm formatted vào các phần tử của balance

  // có lẽ sortedBalances nên thay bằng formattedBalances. Vì sortedBalances mới mảng có các phần tử có cấu trúc dữ liệu là FormattedWalletBalance. Hoặc là thêm formatted: balance.amount.toFixed() vào map và xóa interface FormattedWalletBalance và formattedBalances,
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }); // render row

  return <div {...rest}>{rows}</div>;
};
