import 'dotenv/config';

const baseId = process.env.AIRTABLE_BASE_ID!;
const pat = process.env.AIRTABLE_PAT!;

if (!baseId || !pat) {
  console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${pat}`,
  'Content-Type': 'application/json',
};

async function airtableRequest(endpoint: string, method = 'GET', body?: any) {
  const url = `https://api.airtable.com/v0/${baseId}/${endpoint}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Airtable ${method} ${endpoint} failed: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  console.log("=== UPDATING ACTION 4 IN AIRTABLE ===");

  const action4Id = 'receq4NAEIFCVdNcD';
  const pathway41Id = 'recZwVyBA89joOYOe'; // 4.1 Local Climate Funds
  const pathway42Id = 'rechG5sx4ide7Zsxo'; // 4.2 Financial Instruments and Mechanisms
  const pathway43Id = 'recHLUhrtlsbUNkCb'; // 4.3 Financial Aggregation and Market Shaping

  // Cross-reference IDs
  const pathway12Id = 'rec8KPHGxRyncsXYg'; // 1.2
  const pathway13Id = 'rec9uVdifwHMNd1Aa'; // 1.3
  const pathway22Id = 'recEU7spqUr33oM9S'; // 2.2
  const pathway31Id = 'recG7wIxVJgnhPW6M'; // 3.1
  const pathway32Id = 'rec3uo1IBCauiEimf'; // 3.2

  // 1. Update Action 4 Record
  console.log("1. Updating Action 4 record...");
  await airtableRequest(`Actions/${action4Id}`, 'PATCH', {
    fields: {
      'Title': 'Mobilize Finance and Shape Markets',
      'Description': 'This Action helps national governments to work with cities, subnational governments, and financing partners to mobilize capital and strengthen markets for urban climate solutions. It covers local climate funds, financial instruments and mechanisms, and aggregation approaches that improve financing access, address investment risks, shape markets, and support implementation at scale.',
      'Systems Logic': 'Climate investment portfolios require financing arrangements suited to their needs and risks. Local climate funds can mobilize and channel resources toward priority investments, while financial instruments and mechanisms can help to improve financing terms and manage risks. Aggregation can achieve scale by pooling financing needs, risks, or purchasing demand, strengthening access to capital and markets for climate solutions. These approaches can complement one another.'
    }
  });

  // 2. Update Pathways 4.1, 4.2, 4.3 Overviews & Metadata
  console.log("2. Updating Pathways 4.1, 4.2 and 4.3...");

  const overview41 = 'Local climate funds mobilize and channel financial resources toward locally identified climate investments. They can draw on municipal budgets, national transfers, international grants, philanthropic contributions, and private capital, depending on their design. Funds may take different forms, including municipal, community-based or devolved climate funds and can support investments that are difficult to finance through conventional municipal budgets or commercial sources alone. National governments can enable local climate funds through supportive legal and fiscal frameworks, funding, and partnerships with financial institutions.';

  const adapting41 = [
    'Consider the types of investments local funds need to support. Grant-based arrangements may suit adaptation and public-good projects, often without revenue streams, while repayable finance may be appropriate for revenue-generating projects.',
    'Consider differences in local access to finance. Where municipalities face borrowing restrictions or limited access to financial markets, local funds may rely more heavily on fiscal transfers, grants, or financing channelled through national institutions.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway41Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '4.1 Local Climate Funds',
      'Overview': overview41,
      'Potential National Lead': ['Finance Ministry', 'Urban / Local Government Ministry'],
      'Key Actors': [
        'City / Subnational Governments',
        'National Development Bank',
        'MDB / DFI',
        'Philanthropic Actors',
        'Private Sector',
        'Community Stakeholders',
        'Technical Assistance Providers'
      ],
      'Adapting this pathway to your context': adapting41
    }
  });

  const overview42 = 'National governments can work with development banks and financing partners to deploy financial instruments and mechanisms that help cities access capital for climate projects. These include concessional loans, guarantees, insurance, green bonds, and other risk-sharing mechanisms that address specific financing barriers. Public and concessional resources can also be combined with commercial finance through blended finance arrangements to mobilize additional investment. The choice of instruments depends on project financing needs, risks, local market conditions, and municipal financial capacities.';

  const adapting42 = [
    'Consider municipal borrowing powers and financial regulations when selecting instruments. Where direct borrowing or bond issuance is restricted, national institutions may need to channel financing through intermediaries, such as utilities, public enterprises or public banks.',
    'Consider differences in municipal creditworthiness and financial management capacities. Cities with limited financial capacity may require concessional finance, credit enhancement, or additional support before accessing commercial instruments.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway42Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '4.2 Financial Instruments and Mechanisms',
      'Overview': overview42,
      'Potential National Lead': ['Finance Ministry', 'National Development Bank'],
      'Key Actors': [
        'Relevant Sector Ministries',
        'City / Subnational Governments',
        'MDB / DFI',
        'Commercial Bank',
        'Institutional Investors',
        'Insurers',
        'Guarantee Providers',
        'Technical Assistance Providers'
      ],
      'Adapting this pathway to your context': adapting42
    }
  });

  const overview43 = 'Financial aggregation helps cities and other actors combine financial resources or coordinate demand to improve access to finance, reduce costs, and strengthen markets for climate solutions. On the supply side, it can involve pooling capital from multiple financiers. On the demand side, it can involve aggregating municipal borrowing needs, pooling insurance risks, or coordinating public and private purchasing demand. These approaches can improve access to finance, reduce costs, and shape markets by creating larger investment opportunities, strengthening insurance markets, or signaling demand for low-carbon solutions. National governments can support aggregation through enabling regulations, pooled financing and insurance facilities, national development banks, and coordinated procurement programs.';

  const adapting43 = [
    'Consider the scale and similarity of financing or purchasing needs. Aggregation may offer limited benefits where participation from cities is low or borrowing, insurance, and purchasing requirements differ substantially across municipalities.',
    'Consider existing institutional mandates and capacities. National agencies, municipal financial intermediaries, or intermunicipal partnerships may manage aggregation, depending on their legal authority and ability to coordinate participants.',
    'Account for differences in financial and supplier markets. Where domestic lenders, insurers or low-carbon suppliers are limited, national governments may need to engage international partners or provide credit enhancement for pooled borrowing.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway43Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '4.3 Financial Aggregation and Market Shaping',
      'Overview': overview43,
      'Potential National Lead': ['Finance Ministry', 'National Development Bank'],
      'Key Actors': [
        'Urban / Local Government Ministry',
        'City / Subnational Governments',
        'MDB / DFI',
        'Commercial Bank',
        'Institutional Investors',
        'Insurers',
        'Private Sector',
        'City Networks'
      ],
      'Adapting this pathway to your context': adapting43
    }
  });

  // 3. Update Implementation Guidance for Action 4
  console.log("3. Updating Implementation Guidance for Pathways 4.1, 4.2, 4.3...");
  let allGuidance: any[] = [];
  let offset = '';
  do {
    const res = await airtableRequest(`Implementation%20Guidance?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allGuidance = allGuidance.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const action4Guidance = allGuidance.filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway41Id) || belongs.includes(pathway42Id) || belongs.includes(pathway43Id);
  });

  console.log(`Deleting ${action4Guidance.length} existing guidance steps for Action 4...`);
  for (const g of action4Guidance) {
    await airtableRequest(`Implementation%20Guidance/${g.id}`, 'DELETE');
  }

  const newGuidance = [
    // 4.1
    {
      fields: {
        'Step Title': 'Identify local financing needs and investment gaps',
        'Step Order': 1,
        'Detailed Content': 'Start from city investment plans and portfolios. Assess project ownership, readiness, financing needs, and potential revenue sources (see Pathways 3.1 and 3.2).',
        'Belongs to Pathway': [pathway41Id],
        'Related Pathways': [pathway31Id, pathway32Id]
      }
    },
    {
      fields: {
        'Step Title': 'Support the establishment of local climate funds',
        'Step Order': 2,
        'Detailed Content': 'Help local or subnational governments to establish suitable fund arrangements, considering enabling legal frameworks, fiscal responsibilities, and institutional capacities (see Pathway 2.2).',
        'Belongs to Pathway': [pathway41Id],
        'Related Pathways': [pathway22Id]
      }
    },
    {
      fields: {
        'Step Title': 'Clarify governance arrangements',
        'Step Order': 3,
        'Detailed Content': 'Agree on responsibilities for fund management, resource allocation, and oversight. Ensure local governments retain ownership of investment priorities, with national oversight where appropriate.',
        'Belongs to Pathway': [pathway41Id]
      }
    },
    {
      fields: {
        'Step Title': 'Mobilize sustained finance',
        'Step Order': 4,
        'Detailed Content': 'Connect funds with long-term national funding programs, fiscal transfers, and development partners. Facilitate contributions from philanthropic organizations, businesses, and other financing partners, including through country platforms where relevant (see Pathway 1.3).',
        'Belongs to Pathway': [pathway41Id],
        'Related Pathways': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Strengthen fund management',
        'Step Order': 5,
        'Detailed Content': 'Facilitate cities’ access to financial management and investment appraisal expertise. Establish reporting and monitoring arrangements to track resource allocation, investment outcomes, and fund performance.',
        'Belongs to Pathway': [pathway41Id]
      }
    },

    // 4.2
    {
      fields: {
        'Step Title': 'Identify project financing needs and risk profiles',
        'Step Order': 1,
        'Detailed Content': 'Work with cities, development banks and financing partners to assess project revenue streams, creditworthiness, and financing barriers across municipal pipelines (see Pathways 2.1 and 3.2).',
        'Belongs to Pathway': [pathway42Id],
        'Related Pathways': [pathway32Id]
      }
    },
    {
      fields: {
        'Step Title': 'Select appropriate financial instruments',
        'Step Order': 2,
        'Detailed Content': 'Match financial mechanisms to project requirements and municipal financial capacities. Use concessional loans for projects with limited revenue potential, guarantees to address credit risks, and green bonds or commercial debt for revenue-generating infrastructure.',
        'Belongs to Pathway': [pathway42Id]
      }
    },
    {
      fields: {
        'Step Title': 'Deploy risk mitigation and blended finance',
        'Step Order': 3,
        'Detailed Content': 'Engage national development banks, multilateral institutions and international climate funds to provide guarantees, insurance, and other risk mitigation mechanisms. Where appropriate, use national public finance to help mobilize private investment, as part of a blended finance approach.',
        'Belongs to Pathway': [pathway42Id]
      }
    },
    {
      fields: {
        'Step Title': 'Monitor financing outcomes',
        'Step Order': 4,
        'Detailed Content': 'Track financing mobilized, financing costs, risk reduction, and investment outcomes. Use findings to improve the effectiveness of financial instruments over time.',
        'Belongs to Pathway': [pathway42Id]
      }
    },

    // 4.3
    {
      fields: {
        'Step Title': 'Identify opportunities for aggregation',
        'Step Order': 1,
        'Detailed Content': 'Work with cities, financing institutions, and partners to identify common borrowing, insurance, or purchasing needs, including those emerging from municipal portfolios and pipelines. Assess whether aggregation could improve financing access, reduce costs, or strengthen demand for climate solutions (see Pathway 3.2).',
        'Belongs to Pathway': [pathway43Id],
        'Related Pathways': [pathway32Id]
      }
    },
    {
      fields: {
        'Step Title': 'Select suitable aggregation approaches',
        'Step Order': 2,
        'Detailed Content': 'Explore pooled financing facilities, joint borrowing arrangements, collective insurance or coordinated purchasing, depending on local needs and market conditions. Clarify participating institutions, responsibilities, and financing or purchasing commitments.',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Step Title': 'Establish supportive enabling arrangements',
        'Step Order': 3,
        'Detailed Content': 'Provide clear legal frameworks, standardized procedures, and technical assistance to support aggregation. Where needed, establish credit-enhancement mechanisms or guarantee facilities to lower borrowing costs for pooled financing (see Pathway 2.2).',
        'Belongs to Pathway': [pathway43Id],
        'Related Pathways': [pathway22Id]
      }
    },
    {
      fields: {
        'Step Title': 'Engage market actors',
        'Step Order': 4,
        'Detailed Content': 'Work with institutional investors, commercial lenders, insurers, manufacturers, and solution providers to communicate aggregated demand, establish common specifications, and structure investment or procurement opportunities.',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Step Title': 'Manage implementation and scale',
        'Step Order': 5,
        'Detailed Content': 'Monitor implementation, evaluate cost savings and risk reduction, and refine aggregation models. Use successful pilots to expand participation across cities and sectors over time.',
        'Belongs to Pathway': [pathway43Id]
      }
    }
  ];

  for (let i = 0; i < newGuidance.length; i += 10) {
    const chunk = newGuidance.slice(i, i + 10);
    await airtableRequest('Implementation%20Guidance', 'POST', { records: chunk });
  }
  console.log(`Successfully added ${newGuidance.length} guidance steps for Action 4.`);

  // 4. Update Key Resources (Peer Learning Examples & Tools)
  console.log("4. Updating Key Resources for Pathways 4.1, 4.2, 4.3...");
  let allResources: any[] = [];
  offset = '';
  do {
    const res = await airtableRequest(`Key%20Resources?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allResources = allResources.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const action4Resources = allResources.filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway41Id) || belongs.includes(pathway42Id) || belongs.includes(pathway43Id);
  });

  console.log(`Deleting ${action4Resources.length} existing resources for Action 4...`);
  for (const r of action4Resources) {
    await airtableRequest(`Key%20Resources/${r.id}`, 'DELETE');
  }

  const newResources = [
    // 4.1
    {
      fields: {
        'Example Title': 'Kenya – County Climate Change Funds',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: Kenya shows how national governments can scale locally led climate finance through devolved funding arrangements that include local decision-making and combine domestic resources with international climate finance.',
        'Full Text / Concept Explanation': 'First piloted in Isiolo in 2011–12, County Climate Change Funds (CCCFs) enable Kenyan counties to identify, prioritize, and finance local adaptation projects through county planning and budgeting systems. County and ward committees guide investment decisions, drawing on local knowledge and climate information. Several counties have committed 1–2% of their development budgets to these funds. These commitments helped to attract external finance, including seed funding from the UK and Sweden. CCCFs are aligned with Kenya’s National Adaptation Plan (NAP), the National Climate Change Action Plan, and the Climate Change Act. The success of pilots helped to pave the way for national scale-up. By 2023, all 47 Kenyan counties had CCCFs in place, creating the basis for a new Financing Locally Led Climate Action Program funded by the World Bank and the governments of Denmark and Sweden, and led by the National Treasury.',
        'Learn More URL': 'https://ndcpartnership.org/knowledge-portal/good-practice-database/kenyas-county-climate-change-funds',
        'Belongs to Pathway': [pathway41Id]
      }
    },
    {
      fields: {
        'Example Title': 'Italy - ForestaMi Fund, Milan',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Milan shows how municipal and regional governments can partner with philanthropic institutions and businesses to mobilize dedicated funding for local climate action.',
        'Full Text / Concept Explanation': 'Launched in 2019, Forestami brings together the Municipality and Metropolitan City of Milan, Lombardy Region, universities, foundations and other local institutions to support urban forestry and climate resilience. A local fund was established within Fondazione di Comunità Milano to mobilize contributions from businesses and citizens toward the goal of planting three million trees by 2030. In April 2025, the initiative transitioned into Fondazione Forestami, an independent nonprofit foundation responsible for expanding its activities across the metropolitan area and beyond.',
        'Learn More URL': 'https://forestami.org/en/chi-siamo/il-progetto/',
        'Belongs to Pathway': [pathway41Id]
      }
    },
    {
      fields: {
        'Example Title': "UK – Bristol's Local Climate Investment Funds",
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Bristol shows how cities can mobilize community and private capital through local funds, and how national governments can support the replication of successful models.',
        'Full Text / Concept Explanation': "Through its Climate Action Investment initiative, developed under the EU NetZeroCities Pilot Cities Programme, Bristol City Council enables residents and businesses to invest as little as GBP 5 in energy-efficiency and renewable-energy improvements to council-owned buildings. The initiative raised over GBP 500,000 in its first five weeks toward an initial GBP 1 million target, offering investors a five-year loan with 4.2% annual interest. Separately, the Bristol City Leap Community Energy Fund provides GBP 1.5 million in grants and loans for community-led energy projects, funded equally by private partners Ameresco and Vattenfall. The Bristol City Leap model also informed the UK government's Local Net Zero Accelerator program, which supported a pilot in York and North Yorkshire to explore replicating its approach to mobilizing private investment for local net-zero projects.",
        'Learn More URL': 'https://www.abundanceinvestment.com/council/bristol',
        'Belongs to Pathway': [pathway41Id]
      }
    },
    {
      fields: {
        'Example Title': 'Bhutan – Local Climate Adaptive Living Facility (LoCAL)',
        'Type': 'Peer Learning Example',
        'Order': 4,
        'What you can learn / Why use this': 'Key takeaway: Bhutan shows how national governments can use existing fiscal transfer systems to channel climate finance to local authorities and strengthen domestic financing arrangements.',
        'Full Text / Concept Explanation': 'Introduced in 2011 through a partnership between the Royal Government of Bhutan and UNCDF, LoCAL uses performance-based climate resilience grants and technical assistance to finance locally identified adaptation investments. The program expanded to over 100 local governments, financing more than 350 adaptation investments by 2023. Building on this experience, Bhutan has integrated LoCAL into its national local government financing system and planned to mobilize domestic resources through the same grant mechanism. This would allow the government to sustain and expand local adaptation financing beyond the initial international support. Accordingly, Bhutan has incorporated performance-based grants into its central budgeting system and included climate vulnerability in the formula for allocating resources to local governments.',
        'Learn More URL': 'https://www.uncdf.org/article/8737/water-ingenuity-and-community-with-local-in-bhutan',
        'Belongs to Pathway': [pathway41Id]
      }
    },

    // 4.2
    {
      fields: {
        'Example Title': 'Nigeria – InfraCredit',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: Nigeria shows how national institutions can partner with development finance organizations to reduce credit risks and mobilize long-term domestic capital for climate-related infrastructure.',
        'Full Text / Concept Explanation': "InfraCredit was established in 2017 through a partnership between the Nigeria Sovereign Investment Authority and the Private Infrastructure Development Group's GuarantCo. It provides local currency guarantees that improve the credit quality of infrastructure bonds and attract long-term investment from domestic pension funds, insurers, and banks. By the end of 2024, it had guaranteed 24 transactions, mobilizing over NGN 200 billion in private investment and supporting nearly NGN 150 billion in bond issuances. These include North South Power's NGN 8.5 billion green bond, Nigeria's first certified corporate green bond. Its approach has informed similar credit-enhancement facilities in Pakistan and Kenya, demonstrating how nationally supported guarantees can expand domestic infrastructure financing.",
        'Learn More URL': 'https://www.oecd.org/en/publications/blended-finance-case-studies_2fb90b9a-en/infracredit-making-infrastructure-projects-in-nigeria-more-bankable-through-credit-enhancement_bdb679c6-en.html',
        'Belongs to Pathway': [pathway42Id]
      }
    },
    {
      fields: {
        'Example Title': 'Brazil – BNDES Climate Fund (Fundo Clima)',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Brazil shows how national governments can leverage national development banks to provide preferential, long-term financing for municipal climate investments.',
        'Full Text / Concept Explanation': "Fundo Clima provides climate financing on preferential terms to municipalities, including extended repayment and grace periods. It is coordinated by the Ministry of the Environment and Climate Change and operated by the national development bank BNDES. In May 2026, BNDES announced BRL 500 million in financing for Belo Horizonte's municipal climate-resilience investment plan, including BRL 480 million from Fundo Clima. The financing will support flood and landslide prevention, green infrastructure, and restoration of rivers and water sources.",
        'Learn More URL': 'https://www.bndes.gov.br/SiteBNDES/bndes/bndes_en/Institucional/Social_and_Environmental_Responsibility/climate_fund_program.html',
        'Belongs to Pathway': [pathway42Id]
      }
    },
    {
      fields: {
        'Example Title': 'Greece – EIB Sustainable Urban Development Framework Loans',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Greece shows how national ministries can work with multilateral development banks to finance smaller municipal climate projects through flexible, long-term financing arrangements.',
        'Full Text / Concept Explanation': 'Framework loans from the European Investment Bank (EIB) provide long-term financing for multiple smaller projects under multiyear investment programs, allowing eligible investments to be financed over time without requiring separate loans for each project. In Greece, the EIB signed EUR 1 billion (around USD 1.1 billion) in framework loans to support the Antonis Tritsis national public investment program, led by the Ministry of Interior. Financing in the program is channeled through the Consignment Deposits and Loans Fund for municipal investments in flood protection, sustainable water and waste management, energy-efficient public buildings, and e-mobility.',
        'Learn More URL': 'https://www.eib.org/en/projects/all/20200177',
        'Belongs to Pathway': [pathway42Id]
      }
    },
    {
      fields: {
        'Example Title': 'CCFLA – Financial Instruments Toolkit',
        'Type': 'Tool',
        'Order': 4,
        'What you can learn / Why use this': 'Why use this tool: Identify financial instruments suited to specific urban climate investment needs, financing barriers and local market conditions.',
        'Full Text / Concept Explanation': 'The Financial Instruments Toolkit is an interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant. It provides structured guidance on navigating the spectrum of urban climate finance instruments—from debt, equity, and guarantees to results-based financing and blended capital structures—helping project developers and municipal leaders match the right financial mechanisms to their specific infrastructure and resilience needs.',
        'Learn More URL': 'https://citiesclimatefinance.org/financial-instruments',
        'Belongs to Pathway': [pathway42Id]
      }
    },
    {
      fields: {
        'Example Title': 'ICLEI – Climate Finance Decision-Making Tree',
        'Type': 'Tool',
        'Order': 5,
        'What you can learn / Why use this': 'Why use this tool: Compare financing options and identify instruments appropriate to local government capacities, investment requirements, and financing conditions.',
        'Full Text / Concept Explanation': 'Developed by ICLEI, this tool guides local and regional governments through a series of questions to identify suitable financing options for climate investments. It considers factors such as available municipal resources and assets, borrowing eligibility, project revenue potential, private-sector participation and access to public funding. The decision tree covers financing options including grants, loans, municipal green bonds, public-private partnerships, blended finance and risk mitigation instruments. Each option is accompanied by guidance on its advantages, limitations and relevant case studies, helping governments compare potential financing approaches. National governments can also use the tool to understand municipal financing constraints and identify where public financing, guarantees or regulatory support may be needed to expand access to financing.',
        'Learn More URL': 'https://e-library.iclei.org/uploads/Finance_tree_ENG_100621.pdf',
        'Belongs to Pathway': [pathway42Id]
      }
    },

    // 4.3
    {
      fields: {
        'Example Title': 'India – Tamil Nadu Water and Sanitation Pooled Fund',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': "Key takeaway: India shows how state and national governments can use blended finance, guarantees and credit enhancement to improve smaller municipalities' access to long-term infrastructure finance",
        'Full Text / Concept Explanation': "India illustrates how state and national governments can use credit enhancement to help smaller municipalities access long-term infrastructure finance. Established by the Government of Tamil Nadu in 2002, the Water and Sanitation Pooled Fund pooled the borrowing needs of 13 municipalities and issued a USD 6.2 million bond for water and sanitation investments. To reduce investor risks, the state government established reserve funds and escrow accounts to intercept fiscal transfers if repayments fell short, while a USAID partial guarantee provided additional protection. This blended finance arrangement helped to secure an AA credit rating and 15-year financing for municipalities that would otherwise struggle to access capital markets independently. Building on pooled financing experiences in Tamil Nadu and other states, India's national government established the Pooled Finance Development Fund in 2006 to support state-level financing entities through credit enhancement and project preparation assistance.",
        'Learn More URL': 'https://tnuifsl.com/wspf.asp',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Example Title': 'Sweden – Kommuninvest',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Sweden shows how national legal and regulatory frameworks can enable municipalities to jointly establish financial institutions that pool borrowing needs and improve access to long-term capital.',
        'Full Text / Concept Explanation': "Kommuninvest is a municipally owned financial institution that raises capital from financial markets and lends to its municipal and regional members. Backed by joint guarantees from 282 municipalities and 15 regions in Sweden, it aggregates borrowing needs to improve access to capital and reduce financing costs for local infrastructure, including climate-related investments. In 2025, its total lending reached SEK 563.9 billion (approximately USD 56.8 billion), demonstrating the scale of pooled municipal financing. Sweden's legal framework for municipal borrowing enables this model, while the Swedish Financial Supervisory Authority provides regulatory oversight. While Kommuninvest provides long-term debt financing, there are avenues to enhance its offerings to municipalities in the form of early-stage project preparation, risk capital or coordination of climate investment portfolios.",
        'Learn More URL': 'https://kommuninvest.se/eng/home-page.html',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Example Title': 'Argentina – RAMCC Trust Fund',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Argentina’s intermunicipal aggregation mechanism helps to establish shared financing and procurement to aggregate demand, reduce costs, and implement climate investments.',
        'Full Text / Concept Explanation': 'Established in 2018 by the Argentine Network of Municipalities against Climate Change (RAMCC), the Trust Fund enables participating municipalities to pool resources and collectively procure climate-smart technologies. Its governance includes an Assembly of Mayors representing participating municipalities, an elected executive committee, and a technical secretariat supporting project development and financing. The fund has supported joint procurement of LED streetlighting, helping municipalities to achieve economies of scale, reduce procurement costs, and improve energy efficiency. The model demonstrates how intermunicipal cooperation can strengthen purchasing power and support implementation of local climate action plans.',
        'Learn More URL': 'https://citiesclimatefinance.org/publications/financial-aggregation-blueprints-for-urban-climate-infrastructure',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Example Title': 'India – Grand Challenge for Electric Buses',
        'Type': 'Peer Learning Example',
        'Order': 4,
        'What you can learn / Why use this': 'Key takeaway: India shows how national institutions can aggregate municipal purchasing demand and coordinate procurement to reduce costs and accelerate low-carbon transport deployment.',
        'Full Text / Concept Explanation': "Led by Convergence Energy Services Limited (CESL), a subsidiary of the Ministry of Power's Energy Efficiency Services Limited, the Grand Challenge pooled demand for electric buses across multiple cities through a single procurement process. CESL worked with participating cities to assess fleet requirements, routes and charging infrastructure, while engaging manufacturers to develop standardized tender specifications. Supported by national subsidies and some state contributions, the program used gross-cost contracts under which private operators finance, own and operate buses and charging infrastructure for 12 years, reducing upfront capital requirements for municipalities. This approach helped to achieve economies of scale, lower procurement costs and support wider adoption of electric buses.",
        'Learn More URL': 'https://www.convergence.co.in/public/images/electric_bus/Grand-Challenge-Case-Study-Final-Web-Version.pdf',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Example Title': 'The Philippines – City Disaster Insurance Pool (PCDIP)',
        'Type': 'Peer Learning Example',
        'Order': 5,
        'What you can learn / Why use this': 'Key takeaway: The Philippines shows how national governments can design insurance arrangements to pool municipal disaster risks and improve cities’ access to climate-risk protection.',
        'Full Text / Concept Explanation': 'Developed under the leadership of the Department of Finance with technical assistance from the Asian Development Bank, the Philippine City Disaster Insurance Pool aims to provide affordable parametric insurance against typhoons and earthquakes. Ten cities were identified and agreed to participate in the design process, which included disaster exposure mapping and capacity building. The proposed model will pool municipal insurance demand through the Government Service Insurance System and transfer risks to domestic and international reinsurance markets. This arrangement is expected to reduce insurance costs and provide payouts within 15 business days of qualifying disasters to support early recovery.',
        'Learn More URL': '',
        'Belongs to Pathway': [pathway43Id]
      }
    },
    {
      fields: {
        'Example Title': 'Intra-City Aggregated Procurement Models',
        'Type': 'Tool',
        'Order': 6,
        'What you can learn / Why use this': 'Why use this tool: Identify suitable approaches for coordinating city-wide purchasing demand and shaping markets for low-carbon solutions.',
        'Full Text / Concept Explanation': 'Developed by Cities Climate Finance Leadership Alliance (CCFLA) and Viable Cities, this framework identifies four models cities can use to coordinate public and private demand for low-carbon solutions: market facilitation, material-based mandates, performance-based mandates and tender-based incentives. It explains how cities can use procurement and regulatory powers to create stronger market signals, while national governments can support adoption through enabling regulations, common standards, financing and technical assistance. Developed for green cement and concrete, the approaches can be adapted to other sectors based on local procurement powers and market conditions.',
        'Learn More URL': 'https://citiesclimatefinance.org/publications/catalyzing-aggregated-purchasing-power',
        'Belongs to Pathway': [pathway43Id]
      }
    }
  ];

  for (let i = 0; i < newResources.length; i += 10) {
    const chunk = newResources.slice(i, i + 10);
    await airtableRequest('Key%20Resources', 'POST', { records: chunk });
  }
  console.log(`Successfully added ${newResources.length} resources for Action 4.`);

  console.log("=== ACTION 4 AIRTABLE UPDATE COMPLETE ===");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
