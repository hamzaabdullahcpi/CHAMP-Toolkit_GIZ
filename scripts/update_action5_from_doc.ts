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
  console.log("=== UPDATING ACTION 5 IN AIRTABLE ===");

  const action5Id = 'recCADScendAM5HBJ';
  const pathway51Id = 'recMbKrCtaKwa3C8t'; // 5.1 Institutional Capacity Building
  const pathway52Id = 'recoGXOwaJgMtMzXu'; // 5.2 System Demonstrators
  const pathway53Id = 'recJeXSiMwUcVcTFg'; // 5.3 International Networks and Partnerships

  // Cross-reference IDs
  const pathway11Id = 'recWGEx5x7YpvT9ZP'; // 1.1
  const pathway13Id = 'rec9uVdifwHMNd1Aa'; // 1.3
  const pathway21Id = 'recYHYmT0t2O6FowD'; // 2.1
  const pathway32Id = 'rec3uo1IBCauiEimf'; // 3.2
  const pathway42Id = 'rechG5sx4ide7Zsxo'; // 4.2
  const pathway43Id = 'recHLUhrtlsbUNkCb'; // 4.3

  // 1. Update Action 5 Record
  console.log("1. Updating Action 5 record...");
  await airtableRequest(`Actions/${action5Id}`, 'PATCH', {
    fields: {
      'Title': 'Learn, Strengthen Capacities and Scale Implementation',
      'Description': 'This Action helps national governments to strengthen institutional capacities, learn from implementation, and support the scaling of urban climate investments through national and international partnerships. It covers systematic capacity building, real-world experimentation through System Demonstrators and international networks that facilitate knowledge exchange, access to expertise, financing partnerships, and implementation of effective approaches at scale.',
      'Systems Logic': 'Sustained climate investment requires local capacities that improve through practical experience and learning. Institutional capacity building helps municipal institutions to plan, finance, and implement climate projects, while system demonstrators provide them with opportunities to apply and strengthen capabilities through real-world experimentation. Learnings from implementation can inform future investment decisions, institutional practices and policy improvements. International networks help to cross-pollinate these learnings across cities, connect governments with expertise and financing partners, and support the adaptation and scaling of effective climate finance and implementation approaches.'
    }
  });

  // 2. Update Pathways 5.1, 5.2, 5.3 Overviews & Metadata
  console.log("2. Updating Pathways 5.1, 5.2 and 5.3...");

  const overview51 = 'Cities and subnational governments often lack the institutional capacities needed to plan, finance and implement climate investments consistently. While project-specific technical assistance can address immediate gaps, systematic capacity building strengthens the skills, processes, and institutional knowledge needed for sustained investment. National governments can establish institutional capacity development programs, working with training institutions, development banks and other partners to address common municipal needs. These programs can help cities to apply new skills, strengthen internal systems and reduce dependence on external technical assistance.';

  const adapting51 = [
    'Consider existing institutional arrangements and expertise when designing national programs. Training may be delivered through government institutions, development banks, universities or specialist partners, depending on their mandates and capacities.',
    'Ensure programs are accessible to municipalities with different capacities and resources. Consider local languages, practical training formats, and additional support for smaller cities with limited staff and funding.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway51Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '5.1 Institutional Capacity Building',
      'Overview': overview51,
      'Potential National Lead': ['Urban / Local Government Ministry', 'National Development Bank'],
      'Key Actors': [
        'Climate / Environment Ministry',
        'Planning Ministry',
        'City / Subnational Governments',
        'Academia / Research',
        'Technical Assistance Providers',
        'City Networks',
        'MDB / DFI'
      ],
      'Adapting this pathway to your context': adapting51
    }
  });

  const overview52 = 'System Demonstrators are real-world initiatives that test how multiple interconnected interventions across infrastructure, policy, governance, procurement, and capacity development can work together in practice to deliver urban climate transitions. They help cities and national governments identify and address practical implementation barriers, refine institutional and financial arrangements, and test new business models and procurement approaches in real-world contexts. Learnings from system demonstrators can inform policy and regulatory improvements, build institutional confidence, and create opportunities for investment and scaling.';

  const adapting52 = [
    'Define the scope and boundaries of the system demonstrator according to local priorities and capabilities. A demonstrator may focus on a specific sector, neighbourhood, or city-wide transition, provided it addresses interconnected interventions and governance arrangements.',
    'Align governance and funding arrangements to support experimentation. Ensure participating institutions have the mandate and flexibility to test new approaches, adapt interventions based on early findings, and share learnings.',
    'Plan for evaluation and scaling from the outset. Design evaluation frameworks that capture governance, regulatory, and market learnings alongside technical and financial outcomes, ensuring findings inform national policy, institutional practices, and future investment decisions.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway52Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '5.2 System Demonstrators',
      'Overview': overview52,
      'Potential National Lead': ['Climate / Environment Ministry', 'Urban / Local Government Ministry'],
      'Key Actors': [
        'Relevant Sector Ministries',
        'City / Subnational Governments',
        'National Development Bank',
        'National Regulator',
        'Utilities',
        'Infrastructure Agencies',
        'MDB / DFI',
        'Technical Assistance Providers',
        'Commercial Bank',
        'Private Sector',
        'Academia / Research',
        'Civil Society',
        'City Networks'
      ],
      'Adapting this pathway to your context': adapting52
    }
  });

  const overview53 = 'International networks and partnerships can help national and subnational governments access specialized expertise, financing partners and opportunities for collaboration on urban climate investment. They enable governments to exchange practical experience, address shared investment challenges and develop partnerships that support financing, implementation and scaling. National governments can facilitate cities\' participation in relevant international initiatives and help to translate these connections into technical assistance and financing opportunities.';

  const adapting53 = [
    'Prioritize international initiatives according to national and subnational investment needs. Initiatives may differ in their focus and support, from peer learning and capacity building to financing and implementation partnerships.',
    'Consider participation barriers for smaller cities – these may lack the staff, funding, or international connections to engage in global networks. National governments can facilitate introductions, fund participation, or work through city networks to broaden access via local events and forums.',
    'Account for the duration and continuity of international initiatives. International programs may be time-bound or evolve over time. Lasting benefits depend on whether knowledge, relationships, and capacities are retained within domestic institutions.'
  ].map(b => `• ${b}`).join('\n');

  await airtableRequest(`Pathways/${pathway53Id}`, 'PATCH', {
    fields: {
      'Pathway Title': '5.3 International Networks and Partnerships',
      'Overview': overview53,
      'Potential National Lead': ['Climate / Environment Ministry', 'Urban / Local Government Ministry'],
      'Key Actors': [
        'Finance Ministry',
        'Relevant Sector Ministries',
        'City / Subnational Governments',
        'National Development Bank',
        'MDB / DFI',
        'Bilateral Agencies',
        'City Networks',
        'Technical Assistance Providers',
        'Private Sector'
      ],
      'Adapting this pathway to your context': adapting53
    }
  });

  // 3. Update Implementation Guidance for Action 5
  console.log("3. Updating Implementation Guidance for Pathways 5.1, 5.2, 5.3...");
  let allGuidance: any[] = [];
  let offset = '';
  do {
    const res = await airtableRequest(`Implementation%20Guidance?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allGuidance = allGuidance.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const action5Guidance = allGuidance.filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway51Id) || belongs.includes(pathway52Id) || belongs.includes(pathway53Id);
  });

  console.log(`Deleting ${action5Guidance.length} existing guidance steps for Action 5...`);
  for (const g of action5Guidance) {
    await airtableRequest(`Implementation%20Guidance/${g.id}`, 'DELETE');
  }

  const newGuidance = [
    // 5.1
    {
      fields: {
        'Step Title': 'Identify institutional capacity gaps',
        'Step Order': 1,
        'Detailed Content': 'Work with cities to assess recurring gaps in investment planning, financial management, project preparation, and implementation. Identify priorities for sustained capacity development across municipalities (see Pathway 2.1).',
        'Belongs to Pathway': [pathway51Id],
        'Related Pathways': [pathway21Id]
      }
    },
    {
      fields: {
        'Step Title': 'Develop capacity-building programs',
        'Step Order': 2,
        'Detailed Content': 'Develop training, mentoring, and institutional development programs around identified needs. Include practical skills in climate action and investment planning, financial instruments, business models, and infrastructure delivery.',
        'Belongs to Pathway': [pathway51Id]
      }
    },
    {
      fields: {
        'Step Title': 'Mobilize training partners',
        'Step Order': 3,
        'Detailed Content': 'Engage national development banks, universities, training institutions, and development partners to deliver programs. Build on existing national training systems where possible (see Pathway 5.3).',
        'Belongs to Pathway': [pathway51Id],
        'Related Pathways': [pathway53Id]
      }
    },
    {
      fields: {
        'Step Title': 'Connect learning with practical application',
        'Step Order': 4,
        'Detailed Content': 'Link capacity-building activities to ongoing municipal investment priorities and projects. Use workshops, exercises, and hands-on support to help officials apply new skills.',
        'Belongs to Pathway': [pathway51Id]
      }
    },
    {
      fields: {
        'Step Title': 'Institutionalize capacities and track progress',
        'Step Order': 5,
        'Detailed Content': 'Embed acquired skills into municipal processes, guidance, and staff development programs. Monitor improvements in financial management, investment readiness, and implementation capabilities.',
        'Belongs to Pathway': [pathway51Id]
      }
    },

    // 5.2
    {
      fields: {
        'Step Title': 'Identify system demonstrator opportunities',
        'Step Order': 1,
        'Detailed Content': 'Identify urban systems or transition challenges where interconnected interventions are required to achieve climate goals. Select demonstration sites and sectors based on city commitment, strategic importance and potential for learning and scale (see Pathways 1.1 and 3.2).',
        'Belongs to Pathway': [pathway52Id],
        'Related Pathways': [pathway11Id, pathway32Id]
      }
    },
    {
      fields: {
        'Step Title': 'Support locally led system demonstrators',
        'Step Order': 2,
        'Detailed Content': 'Enable cities and local partners to define implementation portfolios, governance arrangements, and partnership structures. Provide grant funding, technical assistance, and national-level facilitation to support orchestration and execution.',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Step Title': 'Engage actors responsible for implementation',
        'Step Order': 3,
        'Detailed Content': 'Bring together relevant government agencies, utilities, businesses, financiers, communities and other implementation partners. Clarify their roles, contributions and responsibilities for delivering different interventions within the portfolio.',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Step Title': 'Test financial, regulatory and market innovations',
        'Step Order': 4,
        'Detailed Content': 'Use system demonstrators to test new business models, financial instruments, procurement approaches and regulatory adaptations in real-world contexts. Identify institutional and regulatory barriers that require national-level resolution (see Pathways 2.2, 4.2 and 4.3).',
        'Belongs to Pathway': [pathway52Id],
        'Related Pathways': [pathway42Id, pathway43Id]
      }
    },
    {
      fields: {
        'Step Title': 'Establish shared evaluation and learning frameworks',
        'Step Order': 5,
        'Detailed Content': 'Track implementation progress, system-wide impacts, and practical learnings across interventions. Use iterative planning and evaluation cycles to adjust activities and capture insights for national policies and programs.',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Step Title': 'Connect learning with policy, investment and scaling',
        'Step Order': 6,
        'Detailed Content': 'Use evidence from system demonstrators to inform policy, regulatory, and procurement reforms, refine investment planning, and connect prepared project portfolios with national funding and development finance partners (see Pathways 1.3 and 3.2).',
        'Belongs to Pathway': [pathway52Id],
        'Related Pathways': [pathway13Id, pathway32Id]
      }
    },

    // 5.3
    {
      fields: {
        'Step Title': 'Identify opportunities for international engagement',
        'Step Order': 1,
        'Detailed Content': 'Assess where cities could benefit from international expertise, financing partnerships, or collective action on shared climate investment challenges. Identify relevant networks, initiatives and global policy forums, such as the Ministerial Meeting on Urbanization and Climate Change at UNFCCC COPs, where subnational perspectives can inform international discussions and partnerships.',
        'Belongs to Pathway': [pathway53Id]
      }
    },
    {
      fields: {
        'Step Title': 'Facilitate city participation',
        'Step Order': 2,
        'Detailed Content': 'Help cities navigate international programs, eligibility requirements, and partnership opportunities. Work with city associations or intermediaries to broaden participation, particularly where smaller municipalities lack resources or international connections.',
        'Belongs to Pathway': [pathway53Id]
      }
    },
    {
      fields: {
        'Step Title': 'Mobilize finance partners',
        'Step Order': 3,
        'Detailed Content': 'Engage international organizations, development banks, climate funds, and private-sector partners around shared national and subnational investment priorities, including through country platforms where relevant. Explore opportunities for technical assistance, financing, and coordinated implementation support (see Pathway 1.3).',
        'Belongs to Pathway': [pathway53Id],
        'Related Pathways': [pathway13Id]
      }
    },
    {
      fields: {
        'Step Title': 'Track engagement outcomes',
        'Step Order': 4,
        'Detailed Content': 'Monitor financing opportunities or implementation support emerging from international engagement. Integrate learning, expertise, and relationships into national and subnational institutions and capacity-building programs to sustain benefits beyond individual initiatives (see Pathway 5.1).',
        'Belongs to Pathway': [pathway53Id],
        'Related Pathways': [pathway51Id]
      }
    }
  ];

  for (let i = 0; i < newGuidance.length; i += 10) {
    const chunk = newGuidance.slice(i, i + 10);
    await airtableRequest('Implementation%20Guidance', 'POST', { records: chunk });
  }
  console.log(`Successfully added ${newGuidance.length} guidance steps for Action 5.`);

  // 4. Update Key Resources (Peer Learning Examples & Tools)
  console.log("4. Updating Key Resources for Pathways 5.1, 5.2, 5.3...");
  let allResources: any[] = [];
  offset = '';
  do {
    const res = await airtableRequest(`Key%20Resources?pageSize=100${offset ? `&offset=${offset}` : ''}`);
    allResources = allResources.concat(res.records || []);
    offset = res.offset;
  } while (offset);

  const action5Resources = allResources.filter((r: any) => {
    const belongs = r.fields['Belongs to Pathway'] || [];
    return belongs.includes(pathway51Id) || belongs.includes(pathway52Id) || belongs.includes(pathway53Id);
  });

  console.log(`Deleting ${action5Resources.length} existing resources for Action 5...`);
  for (const r of action5Resources) {
    await airtableRequest(`Key%20Resources/${r.id}`, 'DELETE');
  }

  const newResources = [
    // 5.1
    {
      fields: {
        'Example Title': 'South Africa – DBSA Municipal Capacity Development Programme',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: South Africa shows how a national development bank can partner with the private sector to strengthen municipal financial management and infrastructure delivery capabilities.',
        'Full Text / Concept Explanation': 'The Development Bank of Southern Africa (DBSA) illustrates how a national development bank can partner with the private sector to strengthen municipal technical and financial capacities. The DBSA, in partnership with Anglo American, implemented a three-year program across municipalities, investing over ZAR 120 million to train 500 municipal officials and support the development of 26 infrastructure master plans. The program included hands-on training with support for infrastructure planning, revenue collection, financial management, and service delivery. Participating municipalities achieved an average 11.6% improvement in revenue collection.',
        'Learn More URL': 'https://www.dbsa.org/case-studies/anglo-american-municipal-capacity-development-programme',
        'Belongs to Pathway': [pathway51Id]
      }
    },
    {
      fields: {
        'Example Title': 'Morocco – Climate Change Competence Centre',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Morocco shows how a national institution can provide capacity development support for local climate finance and implementation.',
        'Full Text / Concept Explanation': 'The Climate Change Competence Centre of Morocco (4C Maroc) supports training and knowledge exchange across national and local governments, businesses, civil society, and research institutions. The platform has trained over 800 local actors, working with more than 15 national ministries, public institutions, and associations representing regional and local governments. Its activities strengthen capacities to integrate climate priorities into subnational planning and improve local access to climate finance.',
        'Learn More URL': 'https://4c.ma/qui-sommes-nous/',
        'Belongs to Pathway': [pathway51Id]
      }
    },
    {
      fields: {
        'Example Title': 'Sierra Leone – UrbanShift Climate Finance Capacity Building',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Sierra Leone shows how national governments can leverage international capacity-building programs to strengthen climate finance policies and support municipal access to investment preparation.',
        'Full Text / Concept Explanation': 'UrbanShift, a Global Environment Facility-funded program, provides systematic capacity-building support to strengthen urban climate investment capabilities. In Sierra Leone, the Ministry of Finance coordinated UrbanShift activities with Freetown City Council and identified government officials for training. Following participation in a Climate Finance City Academy in 2024, ministry officials recognized gaps in their draft fiscal decentralization policy and incorporated climate considerations into its implementation planning. UrbanShift also facilitated a peer exchange involving national and municipal officials to explore a proposed cable-car transport system for Freetown. This helped secure technical assistance from the C40 Cities Finance Facility for a feasibility study, demonstrating how capacity building and national–local collaboration can support municipal investment preparation.',
        'Learn More URL': 'https://www.shiftcities.org/post/building-equitable-climate-resilient-future-freetown',
        'Belongs to Pathway': [pathway51Id]
      }
    },
    {
      fields: {
        'Example Title': 'City Academy on Finance and Equity (CAFE) Workbook',
        'Type': 'Tool',
        'Order': 4,
        'What you can learn / Why use this': 'Why use this tool: Support practical training on climate financing options, project business models and equitable investment planning.',
        'Full Text / Concept Explanation': 'Developed by the C40 Cities Finance Facility, the CAFE workbook provides practical exercises to help city officials in developing countries enhance their understanding of climate finance instruments, assess project business models and integrate equity considerations into infrastructure investment decisions. The workbook contains case studies, knowledge, and tools to support municipal finance and planning teams in applying these concepts to their projects and programs.',
        'Learn More URL': 'https://c40cff.org/tools/city-academy-on-finance-and-equity-workbook/',
        'Belongs to Pathway': [pathway51Id]
      }
    },

    // 5.2
    {
      fields: {
        'Example Title': 'Sweden – CoAction Lund',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: Sweden shows how nationally funded system demonstrators can help cities to test interconnected climate interventions, identify implementation barriers, and evaluate outcomes.',
        'Full Text / Concept Explanation': 'CoAction Lund, supported through Sweden’s System Demonstrator program, brings together 36 organizations, including infrastructure providers, employers, property owners, universities and solution providers, around more than 40 activities in energy and mobility in Brunnshög, Lund. Led by Lund municipality, the demonstrator tests solutions alongside changes in governance, behavior and business models. CoAction Lund’s funding was kept flexible to allow for resources to shift toward promising solutions, such as EnergyNet – a decentralized electricity network enabling buildings and local energy resources to share renewable electricity. Testing EnergyNet has helped identify regulatory and market barriers related to grid codes, data sharing, and local energy markets, informing its further development and potential expansion. CoAction Lund also uses a shared evaluation framework to track progress across interventions and assess their wider effects on the urban system, helping partners to refine their approaches and share lessons for future implementation.',
        'Learn More URL': 'https://viablecities.se/en/satsningar/coaction/',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Example Title': 'United Kingdom – Bristol Thriving Places',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: Bristol shows how system demonstrators can test new financial appraisal and procurement approaches to overcome infrastructure delivery barriers and inform national programs.',
        'Full Text / Concept Explanation': "Bristol Thriving Places addressed the challenge of delivering affordable, zero-carbon housing on small brownfield sites previously considered unviable. Bristol City Council and the Bristol Housing Festival worked with a consortium led by social housing developer EDAROTH, alongside housing associations, infrastructure providers, government agencies, and research partners. The demonstrator developed an integrated approach involving housing delivery, financial appraisal, regulatory analysis and digital modeling. By aggregating small council-owned sites into one program, Bristol created sufficient scale for development, prompted a review of the council's treasury strategy and secured a development agreement of approximately GBP 10 million (around USD 13 million) through an existing national procurement framework. The approach subsequently informed the UK government's Small Sites Aggregator program, which aims to enable the contruction of 10,000 social rent homes annually.",
        'Learn More URL': 'https://www.centreforthrivingplaces.org/',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Example Title': 'Sweden - Stockholm STOLT',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: Stockholm shows how nationally supported system demonstrators can identify regulatory and procurement barriers, test implementation approaches, and inform future investment decisions.',
        'Full Text / Concept Explanation': "Supported through Sweden's national system demonstrator program, STOLT advances Stockholm's ambition for an emission-free inner city by 2030. It brings together municipal departments, businesses, researchers, and civil society around interventions including environmental zones, fossil-free transport procurement, electrified construction and off-peak logistics. The demonstrator addresses challenges such as limited municipal enforcement powers and the absence of electrification requirements in construction procurement and investment appraisal. Through quarterly planning, evaluation, and adjustment cycles, participating actors test approaches, address implementation barriers, and generate learning to improve procurement practices and inform transport-system transformation.",
        'Learn More URL': 'https://viablecities.se/en/satsningar/snabbsam/',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Example Title': 'Uganda – Makindye Ssabagabo’s Green Community Cities',
        'Type': 'Peer Learning Example',
        'Order': 4,
        'What you can learn / Why use this': 'Key takeaway: Makindye Ssabagabo highlights the importance of locally anchored partnerships and institutional capacity for accessing finance, and implementing and scaling system demonstrators.',
        'Full Text / Concept Explanation': 'Developed through the Climate Smart Cities Challenge, Green Community Cities brought together Makindye Ssabagabo municipality, UN-Habitat, Viable Cities, and an international consortium to address affordable, low-carbon housing as part of a wider urban system. Its proposed portfolio integrated modular and incremental housing, recycled building materials, renewable energy, waste management, water-saving technologies, and local employment. To make housing delivery financially viable and affordable, it also explored a public-private partnership involving municipal support, private landowners, developers, housing cooperatives and investors, alongside concessional finance and affordable housing loans. The initiative has secured approximately USD 380,000 in grant funding, established a recycling operation processing 62 tonnes of plastic monthly and created over 70 jobs. However, the experience also highlighted challenges in translating internationally developed solutions into local implementation, particularly where local institutional relationships and national–local coordination were weaker.',
        'Learn More URL': 'https://challengeworks.org/challenge-prizes/makindye-ssabagabo-climate-smart-cities-challenge/',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Example Title': 'System Demonstrators Grant Calls',
        'Type': 'Peer Learning Example',
        'Order': 5,
        'What you can learn / Why use this': 'Key takeaway: Sweden shows how national grant programs can support the structured design, selection and funding of urban system demonstrators.',
        'Full Text / Concept Explanation': "Sweden's Viable Cities program has established grant calls to support the design and implementation of System Demonstrators. These follow a phased approach, with an initial design stage supporting cities and consortia to develop their proposed interventions, followed by implementation funding for proposals meeting the relevant requirements. Building on this Swedish experience, the Viability Fund for Cities is exploring internationally coordinated grant calls, including common principles, eligibility criteria and funding arrangements across regions.",
        'Learn More URL': 'https://viablecities.se/en/utlysningar/utlysning-15/',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Example Title': 'India – City Investments to Innovate, Integrate and Sustain (CITIIS 2.0)',
        'Type': 'Peer Learning Example',
        'Order': 6,
        'What you can learn / Why use this': 'Key takeaway: CITIIS 2.0 shows how national governments can combine financing, technical assistance, and institutional oversight to support the implementation of municipal climate projects.',
        'Full Text / Concept Explanation': 'India’s national City Investments to Innovate, Integrate and Sustain (CITIIS 2.0) program can support municipal climate project implementation through financing, technical assistance, and institutional oversight. Led by the Ministry of Housing and Urban Affairs in partnership with NIUA, AFD, KfW and the European Union, CITIIS 2.0 supports up to 18 competitively selected city projects focused on circular economy and integrated waste management. A national Project Management Unit at NIUA coordinates program delivery, monitoring, and technical support. Selected cities receive assistance from domestic experts and international mentors on project management, environmental and social safeguards, and implementation challenges.',
        'Learn More URL': 'https://citiis.niua.in/',
        'Belongs to Pathway': [pathway52Id]
      }
    },
    {
      fields: {
        'Example Title': 'A blueprint for designing and funding urban system demonstrator programmes',
        'Type': 'Tool',
        'Order': 7,
        'What you can learn / Why use this': 'Why use this tool: Useful for anyone setting up a system demonstrator programme, from defining the mission and selecting cities to preparing portfolios for investment and procurement.',
        'Full Text / Concept Explanation': 'Developed by Viable Cities and Dark Matter Labs, with contributions from CCFLA, Nesta, UNEP, UN-Habitat, the World Economic Forum and WRI, the blueprint is a guide for funders, national governments, city networks and international organisations designing system demonstrator programmes. A system demonstrator is a portfolio of mutually reinforcing interventions in a defined urban system, designed with the actors who have the mandate to change it. Drawing on Sweden’s system demonstrator programme and the Climate Smart Cities Challenge, the blueprint presents the method, three city cases, a programme model that works as a checklist for a concept note, sample selection criteria and a readiness ladder. For multilevel climate finance, it shows how to anchor demonstrators in national frameworks such as CHAMP-aligned country platforms, separate grant funding for orchestration from capital for implementation, connect portfolios to local climate investment structures and use aggregated demand to create credible markets.',
        'Learn More URL': 'https://viablecities.se/',
        'Belongs to Pathway': [pathway52Id]
      }
    },

    // 5.3
    {
      fields: {
        'Example Title': 'Cities Climate Finance Leadership Alliance (CCFLA)',
        'Type': 'Peer Learning Example',
        'Order': 1,
        'What you can learn / Why use this': 'Key takeaway: CCFLA shows how international networks can connect national and subnational governments with specialized climate finance expertise and opportunities for collaboration.',
        'Full Text / Concept Explanation': 'CCFA brings together national governments, development partners, city networks, financial institutions, organizations, and technical experts to address barriers to urban climate investment. Through thematic Action Groups, members exchange practical experience on project preparation, adaptation finance, enabling environments, private finance, and other emerging challenges. These groups provide opportunities to connect actors across government levels and the climate finance ecosystem, identify common investment barriers, and develop collaborative responses. CCFLA also supports local and regional engagement through its Local Hubs (see Action 1), helping to connect international expertise with local climate finance priorities.',
        'Learn More URL': 'https://citiesclimatefinance.org/the-local-hubs',
        'Belongs to Pathway': [pathway53Id]
      }
    },
    {
      fields: {
        'Example Title': 'First Mover Cities Cohort',
        'Type': 'Peer Learning Example',
        'Order': 2,
        'What you can learn / Why use this': 'Key takeaway: First Mover Cities shows how international public-private collaboration can help cities to explore intra-city aggregated purchasing power and strengthen their ability to shape markets for low-carbon solutions.',
        'Full Text / Concept Explanation': 'First Mover Cities is an emerging city cohort being developed within by the World Economic Forum, drawing on its First Movers Coalition, to explore approaches to intra-city aggregated purchasing power. It aims to bring together city governments, businesses across the supply and demand sides of the construction value chain, finance institutions and other partners to strengthen demand for low-carbon solutions. Initial work focuses on the built environment, with a particular focus on cement and concrete, using multistakeholder dialogues to exchange practical experience on green procurement approaches, governance, tender design and supplier engagement. These exchanges will also explore how cities can develop credible demand packages by coordinating public and private purchasing needs and commitments. Over time, this could inform approaches to intra-city aggregated purchasing and strengthen cities\' ability to shape markets for low-carbon solutions. San Francisco, Boston, Oslo, Stockholm and Belém are the initial First Mover Cities, with ambitions to expand participation globally and potentially extend the approach to other urban value chains, such as mobility solutions.',
        'Learn More URL': '',
        'Belongs to Pathway': [pathway53Id]
      }
    },
    {
      fields: {
        'Example Title': 'Global Platform for Sustainable Cities (GPSC)',
        'Type': 'Peer Learning Example',
        'Order': 3,
        'What you can learn / Why use this': 'Key takeaway: GPSC shows how international partnerships can connect national and subnational governments with technical expertise, investment planning support, and development finance.',
        'Full Text / Concept Explanation': 'Led by the World Bank and supported by the Global Environment Facility (GEF), GPSC provides knowledge exchange, capacity building, and practical tools to support integrated urban sustainability planning and investment. It supports the wider GEF Sustainable Cities Programme, which links a global knowledge platform with country-led, city-level projects financed through GEF resources and development-partner co-financing. This structure connects national and local urban priorities with international expertise, financing partners, and implementation support.',
        'Learn More URL': 'https://www.thegpsc.org/about',
        'Belongs to Pathway': [pathway53Id]
      }
    },
    {
      fields: {
        'Example Title': 'UN-Habitat – RISE-UP',
        'Type': 'Peer Learning Example',
        'Order': 4,
        'What you can learn / Why use this': 'Key takeaway: RISE-UP shows how international partnerships can connect national and local governments with climate finance and technical support for urban adaptation.',
        'Full Text / Concept Explanation': 'Established by UN-Habitat, RISE-UP has worked with national and local governments through its global, regional, and country offices to connect urban resilience priorities with international financing partners. Through partnerships with the Adaptation Fund, Green Climate Fund, and bilateral agencies, including Sweden\'s Sida, RISE UP reports mobilizing over USD 150 million for urban climate resilience initiatives across nearly 30 countries. Although its flagship program concluded in 2025, the RISE UP portfolio continues supporting cities with financing readiness, institutional capacity, and implementation of resilience investments.',
        'Learn More URL': 'https://unhabitat.org/programme/riseup',
        'Belongs to Pathway': [pathway53Id]
      }
    }
  ];

  for (let i = 0; i < newResources.length; i += 10) {
    const chunk = newResources.slice(i, i + 10);
    await airtableRequest('Key%20Resources', 'POST', { records: chunk });
  }
  console.log(`Successfully added ${newResources.length} resources for Action 5.`);

  console.log("=== ACTION 5 AIRTABLE UPDATE COMPLETE ===");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
