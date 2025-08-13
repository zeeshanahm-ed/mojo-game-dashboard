import { Spin } from "antd"


const FallbackLoader = ({ isModal = false }: any) => {
    const modalClass = "absolute backdrop-blur-sm w-full h-full z-50 centered-xy flex justify-center items-center"
    return (
        <div className={`${isModal ? modalClass : 'flex justify-center items-center h-32'}`}>
            <Spin size="large" />
        </div>
    )
}


export default FallbackLoader;