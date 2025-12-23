const asyncHandler = require("express-async-handler")
const walletModel = require("../models/wallet.model")

const addWalletQuery = asyncHandler(async (details) => {
    try {

        const { address, chainId, network, walletType } = details

        if (!address) {
            const res = {
                status: false,
                statusCode: 400,
                message: "address is required"
            }

            return res
        }

        // Find or create wallet entry
        const wallet = await walletModel.findOne({ address });

        if (wallet) {
            wallet.connections += 1;
            wallet.lastConnectedAt = new Date();

            // Update metadata if provided
            if (walletType) wallet.walletType = walletType;

            await wallet.save();
            return {
                status: true,
                statusCode: 200,
                data: wallet
            }
        }

        // Create new wallet record
        const newWallet = await walletModel.create({
            address,
            chainId,
            network,
            walletType,
            firstConnectedAt: new Date(),
            lastConnectedAt: new Date(),
        });

        return {
            status: true,
            statusCode: 200,
            data: newWallet
        }


    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
})


const getWalletQuery = asyncHandler(async (page, limit, search) => {
    try {
        const options = {
            page: page,
            limit: limit
        }
        const wallets = await walletModel.paginate({ address: { $regex: `^${search}`, $options: "i" } }, options)
        const res = {
            status: true,
            statusCode: 200,
            wallets: wallets
        }

        return res
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
})


module.exports = {
    addWalletQuery,
    getWalletQuery
}