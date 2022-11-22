import { faCircleCheck, faClose, faSave, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import { VND_CHAR } from '~/configs';
import LocaleUtil from '~/util/LocaleUtil';
import coinIcon from '~/assets/news/coin.svg';
import paypalIcon from '~/assets/logo/paypal.svg';
import { requestApi } from '~/lib/axios';
import { PAYPAL_API_PATH } from './api/api';
import { Action } from '~/types/product/ProductType';
interface Props {
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
    money: number;
}
export type ItemPayment = {
    name: string;
    sku: string;
    price: string;
    currency: string;
    quantity: number;
};

const BuyCoinModel: React.FC<Props> = props => {
    const onPaymentBuyCoin = async () => {
        const action = Action.Coin;
        const url = '/dashboard/balances?reload=load';
        const price = props.money / 24785;
        const items: ItemPayment[] = [
            {
                name: 'Nạp Coin',
                sku: Math.random().toString(36).substring(7),
                price: price.toFixed(2).toString(),
                currency: 'USD',
                quantity: 1,
            },
        ];
        const res = await requestApi('post', PAYPAL_API_PATH, { items, coin: props.money, action, url });
        if (res.data.success) {
            window.location.href = res.data.result;
        }
    };
    return (
        <AppModalContainer style={{ padding: 0 }}>
            <div className="w-full h-auto mx-auto flex py-2 px-3 relative">
                <div className="flex items-center w-auto ">
                    <img src={coinIcon} alt=" " width="80" height="80" />
                </div>
                <div className="ml-3 flex flex-col w-full">
                    <div className="">
                        <div>
                            <span className="text-[#333] text-base font-bold">Nạp Coin</span>
                        </div>
                        <div className="flex items-center text-xs">
                            Coin nạp thêm: {LocaleUtil.toLocaleString(props.money)}
                        </div>
                    </div>
                    <div className="flex justify-between w-full mt-1">
                        <span className="text-[#050505] text-xs">Số tiền phải trả:</span>
                        <span className="text-[#c74646] text-xs">
                            {LocaleUtil.toLocaleString(props.money)} {VND_CHAR}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full mx-auto h-[50px] flex items-center justify-between p-2">
                <span className="text-[#050505] text-md">Thanh tiền:</span>
                <span className="text-[#c74646] text-md font-bold">
                    {LocaleUtil.toLocaleString(props.money)} {VND_CHAR}
                </span>
            </div>
            <h1 className=" w-full mx-auto mt-1 flex items-center px-2 justify-between font-bold text-md">
                Hình thức thanh toán
            </h1>
            <div className="flex relative border m-2 p-4">
                <div className="flex items-center">
                    <img src={paypalIcon} width={32} alt="" />
                    <div className="text-md ml-2">Ví PayPal</div>
                </div>
                <BaseIcon className="absolute text-[#50bd25] right-0 top-[5px]" icon={faCircleCheck} width={32} />
            </div>
            <div className="flex items-center justify-center w-full mt-2">
                <ButtonBase title="Thanh toán" startIcon={faMoneyBillTransfer} onClick={onPaymentBuyCoin} />
                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
            </div>
        </AppModalContainer>
    );
};

export default BuyCoinModel;
