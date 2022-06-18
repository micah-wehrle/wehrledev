package temp.sitemanager.Window;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import java.awt.event.WindowAdapter;  
import java.awt.event.WindowEvent;  

import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;


public class MyWindow {

    private JFrame frame;

    private JTabbedPane tabs;

        private JPanel runTab;

        private JPanel e2FilesTab;
            private JLabel e2Header;
            private ArrayList<String> e2List;
            private JScrollPane e2ScrollPane;
            private JPanel e2FilesBottomBtnPan;
                //private JButton e2OpenBtn;
                private JButton e2ReparseBtn;
                private JButton e2DeleteBtn;
                private JButton e2NewBtn;

        private JPanel settingsTab;

        private JPanel consoleTab;



    public MyWindow() {
        frame = new JFrame("Wehrle Website Manager");

        frame.setResizable(false);
        frame.setPreferredSize(new Dimension(800,600));

        tabs = new JTabbedPane();
            runTab = new JPanel();
                


            tabs.add("Run", runTab);
            
            e2FilesTab = new JPanel();
                
                e2FilesTab.setLayout(new BoxLayout(e2FilesTab, BoxLayout.Y_AXIS));

                e2Header = new JLabel("");
                e2Header.setAlignmentX(Component.LEFT_ALIGNMENT);
                e2FilesTab.add(e2Header);
                e2List = new ArrayList<String>(0);
                    e2List.add("MayOS v2");
                    e2List.add("gm_paint");
                    e2List.add("gm_paint v2");
                    for(int i = 0; i < 30; i++) {
                        e2List.add("Filler " + i);
                    }

                    e2Header.setText("Total E2 Files: " + e2List.size());
                
                e2ScrollPane = new JScrollPane();
                    final JList<String> e2JList = new JList<String>(e2List.toArray(new String[e2List.size()]));
                    e2ScrollPane.setViewportView(e2JList);
                    e2JList.setLayoutOrientation(JList.VERTICAL);

                    e2JList.addListSelectionListener(new ListSelectionListener(){
                        @Override
                        public void valueChanged(ListSelectionEvent e) {
                            if (e.getValueIsAdjusting()) {

                                @SuppressWarnings("unchecked")
                                JList<String> list = (JList<String>)e.getSource();
                                String listItem = (String)list.getSelectedValue();

                                updateE2DisplayData(listItem);
                            }
                        }  
                    });
                    e2ScrollPane.setAlignmentX(Component.LEFT_ALIGNMENT);
                e2FilesTab.add(e2ScrollPane);
                
                e2FilesBottomBtnPan = new JPanel();
                    e2ReparseBtn = new JButton("Reparse");
                        e2ReparseBtn.addActionListener(new ActionListener() {
                            public void actionPerformed(ActionEvent e) {
                                
                            }
                        });
                    e2FilesBottomBtnPan.add(e2ReparseBtn);

                    e2DeleteBtn = new JButton("Delete");
                        e2DeleteBtn.addActionListener(new ActionListener() {
                            public void actionPerformed(ActionEvent e) {
                                int option = JOptionPane.showConfirmDialog(frame, "Are you sure you want to delete this file? This will only delete the HTML, not the original text file.", "Are ya sure?", JOptionPane.OK_CANCEL_OPTION);
                                
                                if(option == JOptionPane.OK_OPTION) {
                                    deleteE2FromList(null);
                                }
                            }
                        });
                    e2FilesBottomBtnPan.add(e2DeleteBtn);

                    e2NewBtn = new JButton("Create New");
                        e2NewBtn.addActionListener(new ActionListener() {
                            public void actionPerformed(ActionEvent e) {
                                
                            }
                        });
                    e2FilesBottomBtnPan.add(e2NewBtn);
                    e2FilesBottomBtnPan.setAlignmentX(Component.LEFT_ALIGNMENT);
                e2FilesTab.add(e2FilesBottomBtnPan);
                
                
            tabs.add("E2 Files", e2FilesTab);
            settingsTab = new JPanel();
            tabs.add("Settings", settingsTab);
            consoleTab = new JPanel();
            tabs.add("Console", consoleTab);
            

            tabs.setSelectedIndex(1);
        frame.add(tabs);








        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//JFrame.DO_NOTHING_ON_CLOSE);
        
        // frame.addWindowListener(new ClosePopup()); // make the class private when used!

        
    }

    private void updateE2DisplayData(String e2Name) {
        
    }

    private void deleteE2FromList(String e2Name) {

    }


    public class ClosePopup extends WindowAdapter {  
        public void windowClosing( WindowEvent e ) {  
            int option = JOptionPane.showOptionDialog(  
                frame,  
                "Closing this window will shut down the website.",  
                "Shut down website?", 
                //JOptionPane.YES_NO_OPTION,  
                JOptionPane.OK_CANCEL_OPTION,
                JOptionPane.WARNING_MESSAGE, 
                null, 
                null,  
                null 
            );  
            if( option == JOptionPane.OK_OPTION ) {  
                System.out.println("Here");
                System.exit( 0 );  
            }  
        }  
    }  
    
}
