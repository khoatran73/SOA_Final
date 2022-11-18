import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { BaseIcon } from '~/component/Icon/BaseIcon';

interface Props {
    item: BreadcrumbItem[];
    className?: string;
    style?: CSSProperties;
}

type BreadcrumbItem = {
    title: string;
    link?: string;
};

const HomeBreadCrumb: React.FC<Props> = props => {
    return (
        <div className={clsx('my-2 rounded-sm p-3 flex items-center select-none', props.className)} style={props.style}>
            {props.item.map((x, index) => {
                return (
                    <div key={x.title} className="flex items-center">
                        {index > 0 && index < props.item.length && (
                            <div className="mx-2">
                                <BaseIcon
                                    icon={faAnglesRight}
                                    style={{ fontSize: 8 }}
                                    className="relative -top-[2px]"
                                />
                            </div>
                        )}
                        {x.link ? (
                            <Link className="text-xs text-[#33659c] hover:text-[#33659c] hover:underline" to={x.link}>
                                {x.title}
                            </Link>
                        ) : (
                            <div className="text-xs">{x.title}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default HomeBreadCrumb;
