import classNames from 'classnames/bind';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDescription } from '~/hooks';
import { actions, useStore } from '~/store';
import Button from '../Button/Button';
import { CheckIcon, MusicIcon } from '../Icon';
import { Image } from '../Image';
import { AccountPreview } from '../Popper/AccountPreview';
import styles from './VideoBar.module.scss';
import VideoPlay from './VideoPlay';

const cx = classNames.bind(styles);

function VideoItem({ data }) {
    let description = useDescription(data.description);
    // eslint-disable-next-line
    const [state, dispatch] = useStore();

    return (
        <div className={cx('container-item')}>
            <AccountPreview data={data.user} isVideo={true}>
                <Image className={cx('avatar')} src={data.user.avatar} />
            </AccountPreview>
            <div className={cx('DivContentContainer')}>
                <div className={cx('container-item--info')}>
                    <AccountPreview data={data.user} isVideo={true}>
                        <Link to="/">
                            <div className={cx('container-item--nickname')}>
                                {data.user.nickname}
                                {data.user.tick && <CheckIcon />}
                            </div>
                            <div
                                className={cx('container-item--bio')}
                            >{`${data.user.first_name} ${data.user.last_name}`}</div>
                        </Link>
                    </AccountPreview>

                    <div className={cx('container-item--des')}>
                        <div className="description">
                            {Array.isArray(description) &&
                                description.map((item, index) => {
                                    if (item.value === 'text') {
                                        return (
                                            <span key={index} className={cx('text-description')}>
                                                {item.text}
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <Fragment key={index}>
                                                <a
                                                    className={cx('hastag-description')}
                                                    href={`https://www.tiktok.com/tag/${item.text.split('#')[1]}`}
                                                    target="blank"
                                                >
                                                    {item.text}
                                                </a>
                                                <span> </span>
                                            </Fragment>
                                        );
                                    }
                                })}
                        </div>
                    </div>

                    <div className={cx('format-media--container')}>
                        <Link to={'/'} className={cx('format-media')}>
                            <MusicIcon className={cx('format-media--icon')} />
                            {data.music}
                        </Link>
                    </div>
                </div>
                <Button
                    className="btn-follow-video"
                    onClick={() => {
                        dispatch(actions.setModalLogin(true));
                    }}
                >
                    Follow
                </Button>
                <VideoPlay data={data} />
            </div>
        </div>
    );
}

export default VideoItem;
