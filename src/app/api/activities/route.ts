import { NextResponse } from "next/server";
import { RecentSold } from "@/types/dtos/RecentSold.dto";

const activities: RecentSold[] = [
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x380241cA7E41AA18D9FBFFf5832c6eF0BF5Ef7e2",
        bidPrice: 27541000000,
        ids: [],
        amounts: [],
        tx: "0x3cd78c67640bc512f5084c9cdabf6c2b3aa69df69868f73d976d09e4c6169726",
        crtime: 1740429459,
        tokens: [
            {
                tokenId: 95590,
                quality: 6,
                category: 1,
                level: 4,
                specialty: 1,
                hashrate: 354,
                lvHashrate: 930,
                prototype: 41056
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xc7ecdfFF38b865127D2875573aDF9abDC0467fef",
        bidPrice: 31860000000,
        ids: [],
        amounts: [],
        tx: "0xf356aa6f03bf81483559af0f91743c4f435a4147690e9964576bf34e990bceae",
        crtime: 1740162378,
        tokens: [
            {
                tokenId: 95692,
                quality: 6,
                category: 4,
                level: 4,
                specialty: 1,
                hashrate: 350,
                lvHashrate: 920,
                prototype: 44060
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x8C71953a334772f55eA486CA19ac79021d261120",
        type: 1,
        crtime: 1740154173,
        bidPrice: 75000000000,
        tx: "0xaa56f76c2dbee6c7dc98421f93806e13b1c7007c6b47cd39a6dc8a989b213034",
        tokens: [
            {
                tokenId: 81349,
                quality: 6,
                category: 1,
                level: 9,
                specialty: 1,
                hashrate: 230,
                lvHashrate: 1296,
                prototype: 41055
            },
            {
                tokenId: 88569,
                quality: 6,
                category: 2,
                level: 5,
                specialty: 1,
                hashrate: 230,
                lvHashrate: 776,
                prototype: 42051
            },
            {
                tokenId: 88918,
                quality: 6,
                category: 4,
                level: 7,
                specialty: 1,
                hashrate: 230,
                lvHashrate: 1036,
                prototype: 44051
            }
        ],
        ids: [],
        amounts: []
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xbC704058A4C9ea1fD8D83C2cD47C54A7f0d93319",
        bidPrice: 9610000000,
        ids: [],
        amounts: [],
        tx: "0x2a5ee8dcb8aabd544d37383a9d4ba64a0a9348f8c2643584759f3520b5911093",
        crtime: 1740032464,
        tokens: [
            {
                tokenId: 62277,
                quality: 6,
                category: 4,
                level: 4,
                specialty: 1,
                hashrate: 180,
                lvHashrate: 495,
                prototype: 44046
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xbC704058A4C9ea1fD8D83C2cD47C54A7f0d93319",
        bidPrice: 11200000000,
        ids: [],
        amounts: [],
        tx: "0x6890b187166e021c42e21c2b5b5b744ab2902cce90d60e0fef88e9e734a5baf3",
        crtime: 1740032341,
        tokens: [
            {
                tokenId: 41612,
                quality: 6,
                category: 3,
                level: 6,
                specialty: 1,
                hashrate: 180,
                lvHashrate: 726,
                prototype: 43036
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xE9ede5b429f9193183F7c336EF9b9aBB8c691a1F",
        bidPrice: 9800000000,
        ids: [],
        amounts: [],
        tx: "0x9236a5f1fce33c344733ce7ebb9094a0b4f3aa4bd7b4044fa56d12d927380e18",
        crtime: 1739921199,
        tokens: [
            {
                tokenId: 95855,
                quality: 6,
                category: 3,
                level: 1,
                specialty: 1,
                hashrate: 238,
                lvHashrate: 238,
                prototype: 43059
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xE9ede5b429f9193183F7c336EF9b9aBB8c691a1F",
        bidPrice: 9880000000,
        ids: [],
        amounts: [],
        tx: "0x9236a5f1fce33c344733ce7ebb9094a0b4f3aa4bd7b4044fa56d12d927380e18",
        crtime: 1739921199,
        tokens: [
            {
                tokenId: 95852,
                quality: 6,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 239,
                lvHashrate: 239,
                prototype: 41060
            }
        ]
    },
    {
        auctor: "0xfa7DEF68F0E950034bb29bE095F25C1d05134ec5",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        type: 1,
        crtime: 1739858225,
        bidPrice: 40000000000,
        tx: "0x099554ee4d1d3eff8bc3bc22b2e8f585db94da88df5dabfe5c8a1e5ecf0c8cdc",
        tokens: [
            {
                tokenId: 81349,
                quality: 6,
                category: 1,
                level: 9,
                specialty: 1,
                hashrate: 230,
                lvHashrate: 1296,
                prototype: 41055
            },
            {
                tokenId: 88569,
                quality: 6,
                category: 2,
                level: 5,
                specialty: 1,
                hashrate: 230,
                lvHashrate: 776,
                prototype: 42051
            },
            {
                tokenId: 88918,
                quality: 6,
                category: 4,
                level: 7,
                specialty: 1,
                hashrate: 230,
                lvHashrate: 1036,
                prototype: 44051
            }
        ],
        ids: [],
        amounts: []
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xDA070EfC815338e3a16244884a84a3c23c5e1344",
        bidPrice: 37800000000,
        ids: [],
        amounts: [],
        tx: "0xa08b1300ae9049834ba08167fdbd2960376d68e044d707fa1ca19672ab8a5816",
        crtime: 1739751963,
        tokens: [
            {
                tokenId: 68010,
                quality: 6,
                category: 1,
                level: 15,
                specialty: 1,
                hashrate: 190,
                lvHashrate: 1862,
                prototype: 41046
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x5c9466527F547b5BE8233A02498929eB4401A9a7",
        bidPrice: 18900000000,
        ids: [],
        amounts: [],
        tx: "0xdcfd53932de5ec4c87777b2765472f00e8a810763b4204ef19f59ea1ee69bd09",
        crtime: 1739739594,
        tokens: [
            {
                tokenId: 42069,
                quality: 6,
                category: 3,
                level: 9,
                specialty: 1,
                hashrate: 39,
                lvHashrate: 321,
                prototype: 43036
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xe9a1797aB5adcD97EDbC3442Fe48E1e3Ea672aa8",
        bidPrice: 16100000000,
        ids: [],
        amounts: [],
        tx: "0x29ecf1583cf824aecfdf5d60575137844d87b09bbfba0b84a08d83e031a464b2",
        crtime: 1739739057,
        tokens: [
            {
                tokenId: 68240,
                quality: 6,
                category: 1,
                level: 7,
                specialty: 1,
                hashrate: 210,
                lvHashrate: 954,
                prototype: 41048
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x5c9466527F547b5BE8233A02498929eB4401A9a7",
        bidPrice: 27200000000,
        ids: [],
        amounts: [],
        tx: "0x1f207a5256183eba3232e84bd281a6ecce54d010b151d76ba03ddeac646c2612",
        crtime: 1739738898,
        tokens: [
            {
                tokenId: 31792,
                quality: 6,
                category: 1,
                level: 14,
                specialty: 1,
                hashrate: 69,
                lvHashrate: 741,
                prototype: 41022
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x5c9466527F547b5BE8233A02498929eB4401A9a7",
        bidPrice: 27200000000,
        ids: [],
        amounts: [],
        tx: "0x6999fa6234013bbc58b38e52fc3c4c99c6cf61786b87d1b029cfe485680be62a",
        crtime: 1739738871,
        tokens: [
            {
                tokenId: 41728,
                quality: 6,
                category: 2,
                level: 14,
                specialty: 1,
                hashrate: 65,
                lvHashrate: 710,
                prototype: 42037
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x52b3155E55DD6222b62c4d545B578A0b2C92274D",
        bidPrice: 30000000000,
        ids: [],
        amounts: [],
        tx: "0x2b301f9d03ff07df143534c13aa5257b139c1708e862d19e45c9683aa4350814",
        crtime: 1739535415,
        tokens: [
            {
                tokenId: 96196,
                quality: 6,
                category: 2,
                level: 1,
                specialty: 1,
                hashrate: 391,
                lvHashrate: 391,
                prototype: 42057
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x5c9466527F547b5BE8233A02498929eB4401A9a7",
        bidPrice: 13000000000,
        ids: [],
        amounts: [],
        tx: "0x62a9d0f40f4404292fdebfa8955b4b4435a55f1bd7b219ce8da183744fec01da",
        crtime: 1739398127,
        tokens: [
            {
                tokenId: 16132,
                quality: 6,
                category: 4,
                level: 7,
                specialty: 1,
                hashrate: 41,
                lvHashrate: 261,
                prototype: 44008
            }
        ]
    },
    {
        auctor: "0x2B742E770E7Cbe4986DCe39510A0024F4cB73589",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 5000000000,
        ids: [],
        amounts: [],
        tx: "0x775971467e6368d8601480a9df73ff74ad6293a6f56e11a9f6582de33f88472c",
        crtime: 1739384663,
        tokens: [
            {
                tokenId: 42069,
                quality: 6,
                category: 3,
                level: 9,
                specialty: 1,
                hashrate: 39,
                lvHashrate: 321,
                prototype: 43036
            }
        ]
    },
    {
        auctor: "0x2B742E770E7Cbe4986DCe39510A0024F4cB73589",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 9000000000,
        ids: [],
        amounts: [],
        tx: "0x6fcd25d8c2cb7471a365899016a0a7c2ade2ffa9039c3c452df0434ccf2f78e8",
        crtime: 1739383754,
        tokens: [
            {
                tokenId: 41728,
                quality: 6,
                category: 2,
                level: 14,
                specialty: 1,
                hashrate: 65,
                lvHashrate: 710,
                prototype: 42037
            }
        ]
    },
    {
        auctor: "0x2B742E770E7Cbe4986DCe39510A0024F4cB73589",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 3000000000,
        ids: [],
        amounts: [],
        tx: "0x3a49aab747fd8fbb66a4e491940ecfe59c580d62442415117f3acf940dbbf560",
        crtime: 1739381603,
        tokens: [
            {
                tokenId: 16132,
                quality: 6,
                category: 4,
                level: 7,
                specialty: 1,
                hashrate: 41,
                lvHashrate: 261,
                prototype: 44008
            }
        ]
    },
    {
        auctor: "0x2B742E770E7Cbe4986DCe39510A0024F4cB73589",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 5000000000,
        ids: [],
        amounts: [],
        tx: "0x570a2b68c52dd7d4db63d7647e7735318e8afa62fefc1c3233641dfbbf95a7d7",
        crtime: 1739381138,
        tokens: [
            {
                tokenId: 31792,
                quality: 6,
                category: 1,
                level: 14,
                specialty: 1,
                hashrate: 69,
                lvHashrate: 741,
                prototype: 41022
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x9e0C28D174B4495912bE864ca97eCf372a352Bd1",
        bidPrice: 16000000000,
        ids: [],
        amounts: [],
        tx: "0x93f00cdf955b50fc0e675c7846294ed759ec4a41624033a7ef3c821254697437",
        crtime: 1739292508,
        tokens: [
            {
                tokenId: 57212,
                quality: 6,
                category: 4,
                level: 4,
                specialty: 1,
                hashrate: 180,
                lvHashrate: 495,
                prototype: 44045
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x7D4EA170c5a908eFBC1242B9553724C6BC00324F",
        bidPrice: 89000000000,
        ids: [],
        amounts: [],
        tx: "0x2a16d24d75e6838c04c4a0eec7ecd7bc8b887b6d0145e82dcc4dadd39c2bbeaa",
        crtime: 1739045886,
        tokens: [
            {
                tokenId: 51861,
                quality: 6,
                category: 4,
                level: 18,
                specialty: 1,
                hashrate: 300,
                lvHashrate: 3303,
                prototype: 44044
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xE83Bc3b06C0f5C2E6fD8B676B6f7E5b52B071F03",
        bidPrice: 179000000000,
        ids: [],
        amounts: [],
        tx: "0x554f359562a84b29cda2e8b343798cd563d77386d60eefa1c08e2ededb0b704a",
        crtime: 1739017188,
        tokens: [
            {
                tokenId: 95925,
                quality: 6,
                category: 5,
                level: 1,
                specialty: 3,
                hashrate: 809,
                lvHashrate: 809,
                prototype: 50184
            }
        ]
    },
    {
        auctor: "0x07c1D431f9bD919EEBa9e78F2A0BD695940b55b7",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        type: 0,
        crtime: 1738986855,
        bidPrice: 149000000000,
        tx: "0x2f0cddace3ccf75df93a1a5a77083752feb4de450e4f785bbf585ee18c12ea03",
        tokens: [
            {
                tokenId: 26425,
                quality: 6,
                category: 4,
                level: 14,
                specialty: 1,
                hashrate: 181,
                lvHashrate: 1615,
                prototype: 44025
            },
            {
                tokenId: 41612,
                quality: 6,
                category: 3,
                level: 6,
                specialty: 1,
                hashrate: 180,
                lvHashrate: 726,
                prototype: 43036
            },
            {
                tokenId: 55195,
                quality: 6,
                category: 1,
                level: 24,
                specialty: 1,
                hashrate: 228,
                lvHashrate: 3453,
                prototype: 41041
            },
            {
                tokenId: 57212,
                quality: 6,
                category: 4,
                level: 4,
                specialty: 1,
                hashrate: 180,
                lvHashrate: 495,
                prototype: 44045
            },
            {
                tokenId: 62277,
                quality: 6,
                category: 4,
                level: 4,
                specialty: 1,
                hashrate: 180,
                lvHashrate: 495,
                prototype: 44046
            },
            {
                tokenId: 68010,
                quality: 6,
                category: 1,
                level: 15,
                specialty: 1,
                hashrate: 190,
                lvHashrate: 1862,
                prototype: 41046
            },
            {
                tokenId: 68240,
                quality: 6,
                category: 1,
                level: 7,
                specialty: 1,
                hashrate: 210,
                lvHashrate: 954,
                prototype: 41048
            }
        ],
        ids: [],
        amounts: []
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xc581cBA8E6432cd7256743a4E056cB634483482C",
        bidPrice: 30000000000,
        ids: [],
        amounts: [],
        tx: "0x1b232d75ed35012966eb3cf21fb3d03cc7e8e3629d2bd3f0676f9f3717bc72ff",
        crtime: 1738605999,
        tokens: [
            {
                tokenId: 96200,
                quality: 6,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 360,
                lvHashrate: 360,
                prototype: 41060
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xB6442F7808a0268746CA96B0B6B34EBE3d935659",
        bidPrice: 25000000000,
        ids: [],
        amounts: [],
        tx: "0x9f72041375d7660a310ea32814f24e1570b0c13444b898c668b7d2700a528e07",
        crtime: 1738413921,
        tokens: [
            {
                tokenId: 96199,
                quality: 6,
                category: 4,
                level: 1,
                specialty: 1,
                hashrate: 314,
                lvHashrate: 314,
                prototype: 44058
            }
        ]
    },
    {
        auctor: "0xf88A7aca42b62c4EdDb885F918BA4d3480A38086",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 25000000000,
        ids: [],
        amounts: [],
        tx: "0x99d44bfbf34eac90c942958ac9a4c9199b7c2c11a1e4b5015d05a6ac28d6f049",
        crtime: 1738394913,
        tokens: [
            {
                tokenId: 96196,
                quality: 6,
                category: 2,
                level: 1,
                specialty: 1,
                hashrate: 391,
                lvHashrate: 391,
                prototype: 42057
            }
        ]
    },
    {
        auctor: "0xf88A7aca42b62c4EdDb885F918BA4d3480A38086",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 18000000000,
        ids: [],
        amounts: [],
        tx: "0xd00fe3647343cd2fa9b9dbec0470550bd85d8eb915cb4006dfc6b5e441a86140",
        crtime: 1738394871,
        tokens: [
            {
                tokenId: 96200,
                quality: 6,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 360,
                lvHashrate: 360,
                prototype: 41060
            }
        ]
    },
    {
        auctor: "0xf88A7aca42b62c4EdDb885F918BA4d3480A38086",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 13000000000,
        ids: [],
        amounts: [],
        tx: "0x5dd4f5d43ee3e0ad3ea671a5947ffe61d7e433bc9d771954f05d01ea30b05267",
        crtime: 1738394853,
        tokens: [
            {
                tokenId: 96199,
                quality: 6,
                category: 4,
                level: 1,
                specialty: 1,
                hashrate: 314,
                lvHashrate: 314,
                prototype: 44058
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x1c59735e28cb4fc3E23DbE888A8ebF479AE6Bb0e",
        bidPrice: 74000000000,
        ids: [],
        amounts: [],
        tx: "0x86d4e03fd44f403d0322c836792033cd6c30596f11f67da6a835751087cdf6b1",
        crtime: 1738291863,
        tokens: [
            {
                tokenId: 86761,
                quality: 6,
                category: 2,
                level: 14,
                specialty: 1,
                hashrate: 340,
                lvHashrate: 2856,
                prototype: 42053
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xFa2c0EE3882F52DAA44c5aB37e9406bf4C4EC9e8",
        bidPrice: 14700000000,
        ids: [],
        amounts: [],
        tx: "0xfa6db9dca8543711b2ff767c0e185205b008b5d613bc8508469dd6c6fa0238de",
        crtime: 1738285536,
        tokens: [
            {
                tokenId: 95856,
                quality: 6,
                category: 3,
                level: 1,
                specialty: 1,
                hashrate: 258,
                lvHashrate: 258,
                prototype: 43060
            }
        ]
    },
    {
        auctor: "0xbaf0B0F1D4aE45E71650988f054856da5027558C",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 164000000000,
        ids: [],
        amounts: [],
        tx: "0x9d2d67cf8478b412f424d8233afea4f995684a7681e58923b533c5f1dd0f4782",
        crtime: 1738281453,
        tokens: [
            {
                tokenId: 95925,
                quality: 6,
                category: 5,
                level: 1,
                specialty: 3,
                hashrate: 809,
                lvHashrate: 809,
                prototype: 50184
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xA9Fb4B4d4d52Fc23085762e9d6ef466f5C90f50f",
        bidPrice: 7490000000,
        ids: [],
        amounts: [],
        tx: "0x6a3c91e7cabdab420d5ed797f3f77827c3ae27a257bef4d1ce189355d3f9e198",
        crtime: 1738199058,
        tokens: [
            {
                tokenId: 87948,
                quality: 6,
                category: 3,
                level: 1,
                specialty: 1,
                hashrate: 152,
                lvHashrate: 152,
                prototype: 43052
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x98b24E6B52109C70A83783DCB3B6825BA6dEcF3C",
        bidPrice: 80000000000,
        ids: [],
        amounts: [],
        tx: "0xfcf36eb55d9bdbc08bd8e598341982c8aa2f670a902e4a09fb6283acdb1a322c",
        crtime: 1738112070,
        tokens: [
            {
                tokenId: 22507,
                quality: 6,
                category: 2,
                level: 14,
                specialty: 1,
                hashrate: 354,
                lvHashrate: 2965,
                prototype: 42018
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x886a0D42d9F85d57158078f0CC0E8e7be94f856a",
        bidPrice: 1390000000,
        ids: ["21056"],
        amounts: ["1"],
        tx: "0x38a748c2b2e6a0f12f4b230a6c5f282fa8977dceea1461b1f75e3cbe44c47c1b",
        crtime: 1738111014,
        tokens: []
    },
    {
        auctor: "0x089896ae7f27e95712162876106719C5910d2ac9",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 49000000000,
        ids: [],
        amounts: [],
        tx: "0x34cc1d6f4434d71b870937825eb125b5d69c88fd92f2b52239ce5d68252c2ab4",
        crtime: 1738098816,
        tokens: [
            {
                tokenId: 51861,
                quality: 6,
                category: 4,
                level: 18,
                specialty: 1,
                hashrate: 300,
                lvHashrate: 3303,
                prototype: 44044
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x4Cee61efe4D835984cc3Bd50dE9C2B419dC4ef39",
        bidPrice: 3200000000,
        ids: ["31056"],
        amounts: ["1"],
        tx: "0xeb2e78c662dda38ea7403c2e7fb3fb934f48ba3ac816c12c3dc27a2773108f49",
        crtime: 1738091040,
        tokens: []
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x886a0D42d9F85d57158078f0CC0E8e7be94f856a",
        bidPrice: 2880000000,
        ids: ["32059"],
        amounts: ["1"],
        tx: "0x6bf9731d7068b8a5b4056dbe32a2431cabe279bc6f7d1289db9363c61a2d3b6b",
        crtime: 1738087866,
        tokens: []
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x24dd56DAba6fAA6d48557b88AF0E099f2bD87CF5",
        bidPrice: 8390000000,
        ids: [],
        amounts: [],
        tx: "0xffe316db2e26dda138435a43ef39b21404b5226ed72b5ba44c50ee2914624f18",
        crtime: 1737998570,
        tokens: [
            {
                tokenId: 32074,
                quality: 4,
                category: 3,
                level: 1,
                specialty: 0,
                hashrate: 17,
                lvHashrate: 17,
                prototype: 43031
            }
        ]
    },
    {
        auctor: "0x089896ae7f27e95712162876106719C5910d2ac9",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 48000000000,
        ids: [],
        amounts: [],
        tx: "0xe6a2861488d98e9694a92e7f3fbfdd7b86fbb33a8a9b898c30c968598cb3b249",
        crtime: 1737995297,
        tokens: [
            {
                tokenId: 22507,
                quality: 6,
                category: 2,
                level: 14,
                specialty: 1,
                hashrate: 354,
                lvHashrate: 2965,
                prototype: 42018
            }
        ]
    },
    {
        auctor: "0x089896ae7f27e95712162876106719C5910d2ac9",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 49000000000,
        ids: [],
        amounts: [],
        tx: "0x816f4a3a8f061ac8b883aeee405e754229a859ac229c35e35b8e837614580e09",
        crtime: 1737845427,
        tokens: [
            {
                tokenId: 86761,
                quality: 6,
                category: 2,
                level: 14,
                specialty: 1,
                hashrate: 340,
                lvHashrate: 2856,
                prototype: 42053
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x53C2ee6638d9800907a524AaB6C0e98036ac9aBA",
        bidPrice: 430000000000,
        ids: [],
        amounts: [],
        tx: "0xe56404338b493ce2a87c386ec49d05353d65ba4934686b1278e0cbfd4f23f511",
        crtime: 1737811464,
        tokens: [
            {
                tokenId: 38922,
                quality: 6,
                category: 5,
                level: 40,
                specialty: 3,
                hashrate: 620,
                lvHashrate: 17303,
                prototype: 50121
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x10C7C82F30e32D79B2690362E1356069D56a0e20",
        bidPrice: 8990000000,
        ids: [],
        amounts: [],
        tx: "0xcad54436444737bf3dc511338e2ea6e10c88e8778497cd9bc73cccbb67821767",
        crtime: 1737804924,
        tokens: [
            {
                tokenId: 94006,
                quality: 6,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 142,
                lvHashrate: 142,
                prototype: 41055
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x1160606eBB83B4dd890580cf5467611403e7a7b7",
        bidPrice: 50000000000,
        ids: [],
        amounts: [],
        tx: "0xf85bf0107395f293a5ab1c4bc364113464e9397668531b053c5a7ab361e65b73",
        crtime: 1737743058,
        tokens: [
            {
                tokenId: 95696,
                quality: 6,
                category: 2,
                level: 4,
                specialty: 1,
                hashrate: 382,
                lvHashrate: 1000,
                prototype: 42060
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xA8dC002A0C4Fa66Ffd7772f4D2eA59fFa5cf5827",
        bidPrice: 8990000000,
        ids: [],
        amounts: [],
        tx: "0xd3a0259f45d20bf1ca89bda50da77375b14f082f632d54d218b739ca21ccffa9",
        crtime: 1737739017,
        tokens: [
            {
                tokenId: 91724,
                quality: 6,
                category: 2,
                level: 1,
                specialty: 1,
                hashrate: 147,
                lvHashrate: 147,
                prototype: 42053
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xA8dC002A0C4Fa66Ffd7772f4D2eA59fFa5cf5827",
        bidPrice: 9790000000,
        ids: [],
        amounts: [],
        tx: "0xaf1da8a66d2384d370c37b40b12e58564acedda874f9f9240feae9f4ab6863fb",
        crtime: 1737678255,
        tokens: [
            {
                tokenId: 84779,
                quality: 6,
                category: 2,
                level: 1,
                specialty: 1,
                hashrate: 148,
                lvHashrate: 148,
                prototype: 42052
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xbFa5db421d8D9417Ad671C5f032F0c6131Ed6aA4",
        bidPrice: 24900000000,
        ids: [],
        amounts: [],
        tx: "0x9b31047cd2d1116eb4e2d889d29c149bfe87b0a3851495d4a17b8de2218d8e67",
        crtime: 1737523922,
        tokens: [
            {
                tokenId: 95850,
                quality: 6,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 321,
                lvHashrate: 321,
                prototype: 41057
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xBDbC95ee23Fe48Fe9Ebf469768e5f291CD31C775",
        bidPrice: 45000000000,
        ids: [],
        amounts: [],
        tx: "0xaa9e9a2a6a716788f2ed5210de9cc88ab1799977f822717b2ff1df02209e3f74",
        crtime: 1737481239,
        tokens: [
            {
                tokenId: 95521,
                quality: 6,
                category: 2,
                level: 4,
                specialty: 1,
                hashrate: 363,
                lvHashrate: 952,
                prototype: 42059
            }
        ]
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0x0463660DD625589F7E28caf4F89e604f6827784E",
        bidPrice: 1390000000,
        ids: ["22059"],
        amounts: ["1"],
        tx: "0xe74f3d0b5a8d3b997e11386b901f67d3278521c07d7676f3c2133b3dd038d469",
        crtime: 1737457761,
        tokens: []
    },
    {
        auctor: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidder: "0xbC704058A4C9ea1fD8D83C2cD47C54A7f0d93319",
        bidPrice: 14900000000,
        ids: [],
        amounts: [],
        tx: "0xc68e56cd63d281d37e39b269c6342e65a6dd5e2f4fe49914d2f83ccd9d9d0916",
        crtime: 1737264233,
        tokens: [
            {
                tokenId: 95849,
                quality: 6,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 255,
                lvHashrate: 255,
                prototype: 41060
            }
        ]
    },
    {
        auctor: "0x412B3FB1fA37D14679c2a4081A81d8C6d38a5EBD",
        bidder: "0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c",
        bidPrice: 5000000000,
        ids: [],
        amounts: [],
        tx: "0x3bccb0ec73b802a86f2e76f1efc575bd6e8e7f208a6a3900a38fd9d06bc2b99c",
        crtime: 1737262427,
        tokens: [
            {
                tokenId: 32074,
                quality: 4,
                category: 3,
                level: 1,
                specialty: 0,
                hashrate: 17,
                lvHashrate: 17,
                prototype: 43031
            }
        ]
    }
];

export async function GET() {
    return NextResponse.json(activities);
}
