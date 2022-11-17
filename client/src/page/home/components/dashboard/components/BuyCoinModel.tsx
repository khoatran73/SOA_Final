import { faCircleCheck, faClose, faSave, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import { VND_CHAR } from '~/configs';
import LocaleUtil from '~/util/LocaleUtil';
import coinIcon from '~/assets/news/coin.svg';
import paypal from '~/assets/logo/paypal.svg';
import { requestApi } from '~/lib/axios';
import { PAYPAL_API_PATH } from './api/api';
interface Props {
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
    money: number;
}
type ItemPayment = {
    name: string;
    sku: string;
    price: string;
    currency: string;
    quantity: number;
};

const BuyCoinModel: React.FC<Props> = props => {
    const onPaymentBuyCoin = async () => {
        const price = props.money / 24785;
        const data: ItemPayment = {
            name: 'Thanh toán đồng tốt',
            sku: Math.random().toString(36).substring(7),
            price: price.toFixed(2).toString(),
            currency: 'USD',
            quantity: 1,
        };
        const res = await requestApi('post', PAYPAL_API_PATH, { items: [data],coin:props.money });
        if (res.data.success) {
            window.location.href = res.data.result;
        }
    };
    return (
        <AppModalContainer>
            <div className="w-[80%] h-auto mx-auto flex py-2 px-3 relative cursor-pointer border border-[#ebeaea] mt-2">
                <div className="_2ZIVS1lDi3cofxmi0NnPnf flex items-center w-auto ">
                    <img src={coinIcon} alt=" " width="150" height="150" />
                </div>
                <div className="ml-3 flex flex-col w-full">
                    <div className="flex-1">
                        <div>
                            <span className="text-[#333] text-2xl">Thanh toán đồng tốt</span>
                        </div>
                        <div className="mt-3">
                            <i>
                                Đồng tốt nạp thêm : {LocaleUtil.toLocaleString(props.money)} {VND_CHAR}
                            </i>
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        <span className="text-[#050505] text-lg">Số tiền phải trả</span>
                        <span className="text-[#fa5353] text-lg">
                            {LocaleUtil.toLocaleString(props.money)} {VND_CHAR}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-[80%] mx-auto h-[50px] flex items-center justify-between mt-3  border border-[#ebeaea] p-2">
                <span className="text-[#050505] text-xl">Thanh tiền :</span>
                <span className="text-[#c74646] text-xl">
                    {LocaleUtil.toLocaleString(props.money)} {VND_CHAR}
                </span>
            </div>
            <h1 className=" w-[80%] mx-auto mt-3 flex items-center bg-white py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                Hình thức thanh toán
            </h1>
            <div className="w-[80%] mx-auto h-auto flex items-center justify-between mt-3  border border-[#ebeaea] p-2">
                <div>
                    <div className="flex flex-row items-center">
                        <BaseIcon icon={faCircleCheck} className="text-[#00b300] text-2xl ml-2 mr-6 -mt-8" />
                        <div>
                            <span className="text-[#4d4d4d] text-xl">Ví Paypal</span>
                            <img
                                width={94}
                                height={32}
                                className="object-cover cursor-pointer mt-2"
                                src={paypal}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex mx-auto mt-4">
                <ButtonBase
                    className="text-lg"
                    title={`${LocaleUtil.toLocaleString(props.money)} ${VND_CHAR} - Thanh toán`}
                    startIcon={faMoneyBillTransfer}
                    onClick={onPaymentBuyCoin}
                />
                <ButtonBase
                    className="text-lg"
                    title="Đóng"
                    startIcon={faClose}
                    variant="danger"
                    onClick={() => {
                        props.onClose && props.onClose();
                    }}
                />
            </div>
        </AppModalContainer>
    );
};

export default BuyCoinModel;
