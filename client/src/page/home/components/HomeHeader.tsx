import { Avatar, Button, Image } from 'antd';
import Search from 'antd/lib/input/Search';
import clsx from 'clsx';
import React from 'react';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { useMergeState } from '~/hook/useMergeState';
import HomeContainer from '../layout/HomeContainer';

interface State {
    openSearchResult: boolean;
}

const HomeHeader: React.FC = () => {
    const [state, setState] = useMergeState<State>({
        openSearchResult: false,
    });

    const onSearch = (value: string) => {
        // onusubmit search
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value.trim().length > 0) {
            !state.openSearchResult && setState({ openSearchResult: true });
        } else {
            state.openSearchResult && setState({ openSearchResult: false });
        }
    };

    const onBlur = () => {
        state.openSearchResult && setState({ openSearchResult: false });
    };

    const onFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value.trim().length > 0) {
            !state.openSearchResult && setState({ openSearchResult: true });
        } else {
            state.openSearchResult && setState({ openSearchResult: false });
        }
    };

    return (
        <div
            className={clsx(
                'home-header w-full ',
                //
            )}
        >
            <HomeContainer className="flex flex-col justify-between py-0">
                <div className="h-[52%] flex items-center justify-between">
                    <div>
                        <Image
                            src="https://static.chotot.com/storage/default/transparent_logo.webp"
                            //
                            height={35}
                            preview={false}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="flex items-center">
                            <Avatar className="mr-1.5">K</Avatar>
                            Anh Khoa Trần
                        </div>
                    </div>
                </div>
                <div className="h-[48%] flex justify-between">
                    <div className="relative w-[700px]">
                        <Search
                            className="w-full"
                            placeholder="Tìm kiếm..."
                            enterButton
                            onSearch={onSearch}
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        {state.openSearchResult && (
                            <div className="absolute top-10 w-full bg-blue-200 rounded-sm shadow-sm">
                                <div className="px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 ">
                                    item search
                                </div>
                                <div className="px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 ">
                                    item search
                                </div>
                                <div className="px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 ">
                                    item search
                                </div>
                                <div className="px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 ">
                                    item search
                                </div>
                                <div className="px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 ">
                                    item search
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <Button type="primary" danger icon={<BaseIcon className="mr-1.5" icon="edit" />}>
                            Đăng tin
                        </Button>
                    </div>
                </div>
            </HomeContainer>
        </div>
    );
};

export default HomeHeader;
