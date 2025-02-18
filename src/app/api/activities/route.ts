import { NextResponse } from "next/server";
import { RecentSold } from "@/types/dtos/RecentSold.dto";

const activities: RecentSold[] = [
    {
        auctor: "0x3cf0689468a046c3f353F41a71bBeF2c5F486980",
        bidder: "0xF6558e2EAd2A38efA452D1FFE2404cc028a415bC",
        bidPrice: 150000000000,
        ids: [],
        amounts: [],
        tx: "0x63fba299d0294bb4f81bb54f3acd805c9f5f33b4e540c44b78d295c76acfa7f9",
        crtime: 1739807132,
        tokens: [
            {
                tokenId: 17729,
                quality: 6,
                category: 5,
                level: 24,
                specialty: 3,
                hashrate: 107,
                lvHashrate: 2147,
                prototype: 50072
            }
        ]
    },
    {
        auctor: "0x3cf0689468a046c3f353F41a71bBeF2c5F486980",
        bidder: "0x69edDB01e7d81B3E15F3AAF04e432798281baabA",
        bidPrice: 150000000000,
        ids: [],
        amounts: [],
        tx: "0x3d0188e9d1c279fd2e5b2634699dea7fb9304ad48f79ca9f23fa6bf9598c5144",
        crtime: 1739791516,
        tokens: [
            {
                tokenId: 36453,
                quality: 6,
                category: 5,
                level: 19,
                specialty: 3,
                hashrate: 112,
                lvHashrate: 1715,
                prototype: 50108
            }
        ]
    },
    {
        auctor: "0x637D615d210714534A16B5bAb1A66dC4C4914CA8",
        bidder: "0x5c9466527F547b5BE8233A02498929eB4401A9a7",
        type: 0,
        crtime: 1739777246,
        bidPrice: 40000000000,
        tx: "0x18fd8dd931de3736e035832c20284facbefa02e734236cc1c6d694f40dffcdf7",
        tokens: [
            {
                tokenId: 24810,
                quality: 6,
                category: 3,
                level: 4,
                specialty: 1,
                hashrate: 165,
                lvHashrate: 457,
                prototype: 43025
            },
            {
                tokenId: 68920,
                quality: 6,
                category: 3,
                level: 2,
                specialty: 1,
                hashrate: 165,
                lvHashrate: 262,
                prototype: 43050
            },
            {
                tokenId: 68927,
                quality: 6,
                category: 4,
                level: 4,
                specialty: 1,
                hashrate: 165,
                lvHashrate: 457,
                prototype: 44047
            },
            {
                tokenId: 72165,
                quality: 6,
                category: 3,
                level: 2,
                specialty: 1,
                hashrate: 165,
                lvHashrate: 262,
                prototype: 43047
            },
            {
                tokenId: 74323,
                quality: 6,
                category: 3,
                level: 1,
                specialty: 1,
                hashrate: 117,
                lvHashrate: 117,
                prototype: 43049
            }
        ],
        ids: [],
        amounts: []
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
        auctor: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidder: "0x053A5495eAe902F7773B08FF1C323F4B7F250155",
        bidPrice: 35000000000,
        ids: [],
        amounts: [],
        tx: "0x1ca46fa96f6869215fca6304b11cdf5f78af9ff95721b8dbc13b93c47b73363b",
        crtime: 1739791897,
        tokens: [
            {
                tokenId: 74330,
                quality: 6,
                category: 2,
                level: 6,
                specialty: 1,
                hashrate: 370,
                lvHashrate: 1410,
                prototype: 42046
            }
        ]
    },
    {
        auctor: "0x1a1291f865ef342ed819d8938e4B65632ea0FE01",
        bidder: "0x69edDB01e7d81B3E15F3AAF04e432798281baabA",
        bidPrice: 33000000000,
        ids: [],
        amounts: [],
        tx: "0xd7a6cb41f85112b7235ef63c9c8d9485d506ebeea571b965cfb40c1c51dd726f",
        crtime: 1739814101,
        tokens: [
            {
                tokenId: 91447,
                quality: 6,
                category: 5,
                level: 8,
                specialty: 3,
                hashrate: 383,
                lvHashrate: 1962,
                prototype: 50179
            }
        ]
    },
    {
        auctor: "0x8B5DA11bD2955569a6408050246f14b5340f61c8",
        bidder: "0x0c3e49f11d4BEe2F52401F7f5645d792C2098D46",
        bidPrice: 12900000000,
        ids: [],
        amounts: [],
        tx: "0x3cfdcc894bab9c6b42a0310c401e2267e0bd8ce781746da64e7e299d959d1416",
        crtime: 1739780207,
        tokens: [
            {
                tokenId: 92287,
                quality: 6,
                category: 2,
                level: 1,
                specialty: 1,
                hashrate: 225,
                lvHashrate: 225,
                prototype: 42055
            }
        ]
    },
    {
        auctor: "0x316f3a99a78254466373B99Bb9a0Ac5920046568",
        bidder: "0x0c3e49f11d4BEe2F52401F7f5645d792C2098D46",
        bidPrice: 11000000000,
        ids: [],
        amounts: [],
        tx: "0x3cfdcc894bab9c6b42a0310c401e2267e0bd8ce781746da64e7e299d959d1416",
        crtime: 1739780207,
        tokens: [
            {
                tokenId: 89793,
                quality: 6,
                category: 4,
                level: 1,
                specialty: 1,
                hashrate: 117,
                lvHashrate: 117,
                prototype: 44051
            }
        ]
    },
    {
        auctor: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidder: "0x4114463F52401b22C8127Bc76bC7Ec129928cA97",
        bidPrice: 10000000000,
        ids: [],
        amounts: [],
        tx: "0x123f9076d8587dfa10af3c12c8aac146b6a82952c556c5d61cba3d0cf6869090",
        crtime: 1739790457,
        tokens: [
            {
                tokenId: 96272,
                quality: 6,
                category: 3,
                level: 1,
                specialty: 1,
                hashrate: 277,
                lvHashrate: 277,
                prototype: 43058
            }
        ]
    },
    {
        auctor: "0xf7cFC6aA84dcB5d6B7Ea76c236E2Bb661e3824a0",
        bidder: "0x0c3e49f11d4BEe2F52401F7f5645d792C2098D46",
        bidPrice: 8900000000,
        ids: [],
        amounts: [],
        tx: "0x07b8d42f633a8abc874853328c9f0e48d7f454911b7fcb45b0c9185354dd0020",
        crtime: 1739780321,
        tokens: [
            {
                tokenId: 48433,
                quality: 6,
                category: 1,
                level: 3,
                specialty: 1,
                hashrate: 54,
                lvHashrate: 138,
                prototype: 41040
            }
        ]
    },
    {
        auctor: "0x60E445dC32Ecd20c60687803605d156d283ae6c0",
        bidder: "0x7d9Ff29Eb0a34D6D8B715F7EA134E96Dd6BfF4Bc",
        bidPrice: 6200000000,
        ids: ["11051", "12021", "12028", "12040", "14001", "14009"],
        amounts: ["1", "1", "1", "1", "1", "1"],
        tx: "0x6e785c976509c770068e33f4bab9290282da5fa0a213ac6509826a15b418e3b7",
        crtime: 1739807099,
        tokens: []
    },
    {
        auctor: "0xfa7DEF68F0E950034bb29bE095F25C1d05134ec5",
        bidder: "0x2D02D9fa00eFE096068c733e925035aBB9661e98",
        bidPrice: 3500000000,
        ids: ["33029", "32052", "31051", "31004", "24019", "22053"],
        amounts: ["1", "1", "1", "1", "1", "1"],
        tx: "0xb1a46e1eb6b1a2b041f715d978661f259ce4298d74419365b0d21516286657b1",
        crtime: 1739857721,
        tokens: []
    },
    {
        auctor: "0xfa7DEF68F0E950034bb29bE095F25C1d05134ec5",
        bidder: "0x2D02D9fa00eFE096068c733e925035aBB9661e98",
        bidPrice: 3200000000,
        ids: ["22015", "21022", "21001", "11018"],
        amounts: ["1", "1", "1", "1"],
        tx: "0x55b83f32dd4d96fb18768eac9312183954d532b65bdd5fd83e89aded948d72d4",
        crtime: 1739800973,
        tokens: []
    },
    {
        auctor: "0xEB645313B8de46969Fb0C820525Bf83061b160DC",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 2994000000,
        ids: ["12053"],
        amounts: ["1"],
        tx: "0x0f8275017be69c901a1181efca464581dee9c3caabf96a7eae984aac75fb0f82",
        crtime: 1739815475,
        tokens: []
    },
    {
        auctor: "0x8dd2831C7D66aC94d9048e31198892bf2655AfF6",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 2554000000,
        ids: ["11024"],
        amounts: ["1"],
        tx: "0x8af5b5c712124e3e0c486a6d106d6c79352e5eee460e7befe150e6e5779be70a",
        crtime: 1739841348,
        tokens: []
    },
    {
        auctor: "0xbaf0B0F1D4aE45E71650988f054856da5027558C",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 2500000000,
        ids: ["22046"],
        amounts: ["1"],
        tx: "0x2d366f13426e0aa6e30bf01de17d70b82b983bee36955a20d8fe12fd9dbca2c0",
        crtime: 1739790025,
        tokens: []
    },
    {
        auctor: "0xEB645313B8de46969Fb0C820525Bf83061b160DC",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 2494000000,
        ids: ["22046"],
        amounts: ["1"],
        tx: "0x2d366f13426e0aa6e30bf01de17d70b82b983bee36955a20d8fe12fd9dbca2c0",
        crtime: 1739790025,
        tokens: []
    },
    {
        auctor: "0x24dd56DAba6fAA6d48557b88AF0E099f2bD87CF5",
        bidder: "0x0c3e49f11d4BEe2F52401F7f5645d792C2098D46",
        bidPrice: 2485000000,
        ids: ["21040"],
        amounts: ["1"],
        tx: "0x07b8d42f633a8abc874853328c9f0e48d7f454911b7fcb45b0c9185354dd0020",
        crtime: 1739780321,
        tokens: []
    },
    {
        auctor: "0x24dd56DAba6fAA6d48557b88AF0E099f2bD87CF5",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 2435000000,
        ids: ["12051"],
        amounts: ["1"],
        tx: "0x97f50e1e3984ba8e3d8bfdf57ae8ddc9c31029e04394c1d1ad75a7fda2b7c3fa",
        crtime: 1739789974,
        tokens: []
    },
    {
        auctor: "0x2D02D9fa00eFE096068c733e925035aBB9661e98",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 2434000000,
        ids: ["12051"],
        amounts: ["1"],
        tx: "0x97f50e1e3984ba8e3d8bfdf57ae8ddc9c31029e04394c1d1ad75a7fda2b7c3fa",
        crtime: 1739789974,
        tokens: []
    },
    {
        auctor: "0x68EdDaeAF7ef452020126Dd2b3bA74A9587EB0c1",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 2200000000,
        ids: ["32053"],
        amounts: ["1"],
        tx: "0x2db4a25a19a710be151afb7ee979734c2bda641692c268cb1835cc35e68f2302",
        crtime: 1739815460,
        tokens: []
    },
    {
        auctor: "0x575A5f29e02b4BeEF61626981B6484A6fA3a4d89",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 2169000000,
        ids: ["12052"],
        amounts: ["1"],
        tx: "0xf4b090b6c52c9a64d4bfc0a4c8f2456142778b311fbf44d1ad92b725195302c6",
        crtime: 1739790091,
        tokens: []
    },
    {
        auctor: "0x575A5f29e02b4BeEF61626981B6484A6fA3a4d89",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 2158000000,
        ids: ["12053"],
        amounts: ["1"],
        tx: "0x1051cdaa0abb59772643dac788ce3849e39a31d7ecdab97c285494e3e58a9fc7",
        crtime: 1739806457,
        tokens: []
    },
    {
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 2000000000,
        ids: ["21024"],
        amounts: ["1"],
        tx: "0x8af5b5c712124e3e0c486a6d106d6c79352e5eee460e7befe150e6e5779be70a",
        crtime: 1739841348,
        tokens: []
    },
    {
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 2000000000,
        ids: ["21024"],
        amounts: ["1"],
        tx: "0x8af5b5c712124e3e0c486a6d106d6c79352e5eee460e7befe150e6e5779be70a",
        crtime: 1739841348,
        tokens: []
    },
    {
        auctor: "0x8E374E6649Ad33b7F1ab50290303440F1b3deFdb",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 2000000000,
        ids: ["22053"],
        amounts: ["1"],
        tx: "0x1666eb818e5288419fbab8b1e991a0dc5dbb2148f453ff96a6bf1b8bfafd2343",
        crtime: 1739815355,
        tokens: []
    },
    {
        auctor: "0x8dd2831C7D66aC94d9048e31198892bf2655AfF6",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 1994000000,
        ids: ["22051"],
        amounts: ["1"],
        tx: "0x97f50e1e3984ba8e3d8bfdf57ae8ddc9c31029e04394c1d1ad75a7fda2b7c3fa",
        crtime: 1739789974,
        tokens: []
    },
    {
        auctor: "0xB0e5dF02428F660455D1f0b61926966899239Dd4",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 1970000000,
        ids: ["12053"],
        amounts: ["1"],
        tx: "0x893d2c2977b9de2cec71f908817fc011f966837b1625beb0dd6523436ef1a28e",
        crtime: 1739806064,
        tokens: []
    },
    {
        auctor: "0xbaf0B0F1D4aE45E71650988f054856da5027558C",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 1920000000,
        ids: ["12053"],
        amounts: ["1"],
        tx: "0x8864bea223703269eafdbe10747fdf92d3be16d37cb260c57ae3c5d17d05029b",
        crtime: 1739806016,
        tokens: []
    },
    {
        auctor: "0xbaf0B0F1D4aE45E71650988f054856da5027558C",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 1910000000,
        ids: ["12053"],
        amounts: ["1"],
        tx: "0x341da2b5680550cbb8e5505d6d9ff4c8522832ed4f58f3e1336e5bef9c4d8814",
        crtime: 1739805827,
        tokens: []
    },
    {
        auctor: "0x4E73B2EA3c87b2De5b231D5DB4fA48Ab0307D411",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 1900000000,
        ids: ["22053"],
        amounts: ["1"],
        tx: "0x994da69232a8c0030a7d0a5c941b35749e9edb00899b6c2095cb0336b365402b",
        crtime: 1739805986,
        tokens: []
    },
    {
        auctor: "0x9E1Fc59e18bafB0380653C4aebDb0b132cF74DC6",
        bidder: "0x0c3e49f11d4BEe2F52401F7f5645d792C2098D46",
        bidPrice: 1840000000,
        ids: ["34051"],
        amounts: ["1"],
        tx: "0x3cfdcc894bab9c6b42a0310c401e2267e0bd8ce781746da64e7e299d959d1416",
        crtime: 1739780207,
        tokens: []
    },
    {
        auctor: "0xe180Fc68d7A1BF1E4E9741522be482Daa2a5c054",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 1690000000,
        ids: ["12046"],
        amounts: ["1"],
        tx: "0x2d366f13426e0aa6e30bf01de17d70b82b983bee36955a20d8fe12fd9dbca2c0",
        crtime: 1739790025,
        tokens: []
    },
    {
        auctor: "0xe180Fc68d7A1BF1E4E9741522be482Daa2a5c054",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 1680000000,
        ids: ["12046"],
        amounts: ["1"],
        tx: "0x2d366f13426e0aa6e30bf01de17d70b82b983bee36955a20d8fe12fd9dbca2c0",
        crtime: 1739790025,
        tokens: []
    },
    {
        auctor: "0x915138086428B63841f3425e3C097b407325e2FB",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 1400000000,
        ids: ["31024"],
        amounts: ["1"],
        tx: "0x5f1c5eb3f3c062b9ea7b51076ce371b3c5fd34b188eef99e60fd17bc0b2dfcde",
        crtime: 1739840901,
        tokens: []
    },
    {
        auctor: "0x83b0786689485857c38aEd77f05468602da18706",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 1219000000,
        ids: ["21024"],
        amounts: ["1"],
        tx: "0x5f1c5eb3f3c062b9ea7b51076ce371b3c5fd34b188eef99e60fd17bc0b2dfcde",
        crtime: 1739840901,
        tokens: []
    },
    {
        auctor: "0x2D02D9fa00eFE096068c733e925035aBB9661e98",
        bidder: "0xD1300715D627691C9EcD139A5790C91dCC500B3f",
        bidPrice: 1219000000,
        ids: ["12052"],
        amounts: ["1"],
        tx: "0xf4b090b6c52c9a64d4bfc0a4c8f2456142778b311fbf44d1ad92b725195302c6",
        crtime: 1739790091,
        tokens: []
    },
    {
        auctor: "0xa96184d0D938B5037F49107E57f39E6Bc1a6FD8E",
        bidder: "0xCbA5d1Cb8fA2667077f68126566183Ac2Ab78cD6",
        bidPrice: 1180000000,
        ids: ["13038"],
        amounts: ["1"],
        tx: "0xde3ce946709721187e17cdb2ed7fa7e9f434565d1232f67001bec20e9feb3817",
        crtime: 1739815835,
        tokens: []
    },
    {
        auctor: "0x8B5DA11bD2955569a6408050246f14b5340f61c8",
        bidder: "0x679DEEB00D8D8D2537D4204A2b6dCD57C79E7125",
        bidPrice: 1180000000,
        ids: ["12048"],
        amounts: ["1"],
        tx: "0x5371cd86727d71171c498297e7f2a37f20c63af094510b872c4c1d6ae70e6ada",
        crtime: 1739794291,
        tokens: []
    },
    {
        auctor: "0x60E445dC32Ecd20c60687803605d156d283ae6c0",
        bidder: "0x0c3e49f11d4BEe2F52401F7f5645d792C2098D46",
        bidPrice: 1160000000,
        ids: ["11040"],
        amounts: ["1"],
        tx: "0x07b8d42f633a8abc874853328c9f0e48d7f454911b7fcb45b0c9185354dd0020",
        crtime: 1739780321,
        tokens: []
    },
    {
        auctor: "0x60E445dC32Ecd20c60687803605d156d283ae6c0",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 1140000000,
        ids: ["11024"],
        amounts: ["1"],
        tx: "0x5f1c5eb3f3c062b9ea7b51076ce371b3c5fd34b188eef99e60fd17bc0b2dfcde",
        crtime: 1739840901,
        tokens: []
    },
    {
        auctor: "0x60E445dC32Ecd20c60687803605d156d283ae6c0",
        bidder: "0xCbA5d1Cb8fA2667077f68126566183Ac2Ab78cD6",
        bidPrice: 1130000000,
        ids: ["14040"],
        amounts: ["1"],
        tx: "0x6920f683f5e3ee6640ab9f01265734d4e7405dad508c3825226b0160d5a3f4db",
        crtime: 1739815883,
        tokens: []
    },
    {
        auctor: "0x0CB73DCA383e127534f4d27a521913a261cD321d",
        bidder: "0xCbA5d1Cb8fA2667077f68126566183Ac2Ab78cD6",
        bidPrice: 1130000000,
        ids: ["21020"],
        amounts: ["1"],
        tx: "0xd6e4ccb6a3d052afda49fcfedcf13a47b6e7fe3779ebd6350aa79ad0d6619218",
        crtime: 1739815484,
        tokens: []
    },
    {
        auctor: "0x8cC57cd5444e37e4F55Ab220BF40e5fab23204D2",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 1100000000,
        ids: ["12011"],
        amounts: ["1"],
        tx: "0x5f1c5eb3f3c062b9ea7b51076ce371b3c5fd34b188eef99e60fd17bc0b2dfcde",
        crtime: 1739840901,
        tokens: []
    },
    {
        auctor: "0xf00141192d29a1f43D08E02747BdA10Bf3A4384F",
        bidder: "0xCbA5d1Cb8fA2667077f68126566183Ac2Ab78cD6",
        bidPrice: 1100000000,
        ids: ["22052"],
        amounts: ["1"],
        tx: "0x01468ca19360d2bcbeed106af5da8618dfb306f4dacbca7140244cfdfd7dd04d",
        crtime: 1739815670,
        tokens: []
    },
    {
        auctor: "0x2D02D9fa00eFE096068c733e925035aBB9661e98",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 1099000000,
        ids: ["13026"],
        amounts: ["1"],
        tx: "0x5f1c5eb3f3c062b9ea7b51076ce371b3c5fd34b188eef99e60fd17bc0b2dfcde",
        crtime: 1739840901,
        tokens: []
    },
    {
        auctor: "0x2D02D9fa00eFE096068c733e925035aBB9661e98",
        bidder: "0xCbA5d1Cb8fA2667077f68126566183Ac2Ab78cD6",
        bidPrice: 1099000000,
        ids: ["12054"],
        amounts: ["1"],
        tx: "0xd41388176de9402dcaa8352cca7e3bccaf55de2734328c76d94daa87ba2c2ab6",
        crtime: 1739815694,
        tokens: []
    },
    {
        auctor: "0x05e5A3E89794434042d4B8E51853fe28353F3343",
        bidder: "0xA16F2a076812dF8F43f0dbcb7EFDc1f801E84bA1",
        bidPrice: 1090000000,
        ids: ["13005"],
        amounts: ["1"],
        tx: "0x5f1c5eb3f3c062b9ea7b51076ce371b3c5fd34b188eef99e60fd17bc0b2dfcde",
        crtime: 1739840901,
        tokens: []
    },
    {
        auctor: "0x8B5DA11bD2955569a6408050246f14b5340f61c8",
        bidder: "0x604BF7473D3e7ec82A66527F51869180e5Cc0E3F",
        bidPrice: 1070000000,
        ids: ["21052"],
        amounts: ["1"],
        tx: "0x1c5a129a6cf2a29fa6deae7a4e9787f4e058785dd695bb2c3caeae9369a51e1c",
        crtime: 1739815565,
        tokens: []
    },
    {
        auctor: "0x90fB981f83Eb45763C2D98ea8592bDcdcAc67588",
        bidder: "0xCbA5d1Cb8fA2667077f68126566183Ac2Ab78cD6",
        bidPrice: 1050000000,
        ids: ["22054"],
        amounts: ["1"],
        tx: "0x2a4545f638025798e023ce6ecb4d0881aa975bdfd618b63c10e1ee040994e245",
        crtime: 1739815703,
        tokens: []
    }
];

export async function GET() {
    return NextResponse.json(activities);
}
