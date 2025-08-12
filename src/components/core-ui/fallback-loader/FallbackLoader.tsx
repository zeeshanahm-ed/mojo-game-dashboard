import { Spin } from "antd"


const FallbackLoader = () => {
    return (
        <div className='flex justify-center items-center h-32'>
            <Spin size="large" />
        </div>
    )
}


export default FallbackLoader;