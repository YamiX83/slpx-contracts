import { ethers, upgrades } from "hardhat";

async function main() {
  const [caller] = await ethers.getSigners();

  const deployedProxyAddress = "0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9";

  const AddressToAccount = await ethers.getContractFactory(
    "AddressToAccount",
    caller
  );
  const addressToAccount = await AddressToAccount.deploy();
  await addressToAccount.deployed();
  console.log("AddressToAccount deployed to:", addressToAccount.address);

  const BuildCallData = await ethers.getContractFactory(
    "BuildCallData",
    caller
  );
  const buildCallData = await BuildCallData.deploy();
  await buildCallData.deployed();
  console.log("BuildCallData deployed to:", buildCallData.address);

  const AstarXcmAction = await ethers.getContractFactory("AstarXcmAction", {
    libraries: {
      AddressToAccount: addressToAccount.address,
      BuildCallData: buildCallData.address,
    },
  });

  await upgrades.upgradeProxy(deployedProxyAddress, AstarXcmAction, {
    unsafeAllow: ["external-library-linking"],
  });
}

main()
  .then()
  .catch((err) => console.log(err))
  .finally(() => process.exit());